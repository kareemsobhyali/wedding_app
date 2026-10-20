import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import QuickCreateModal from './QuickCreateModal';

import { prisma } from '@/lib/prisma';
import { InvitationStatus, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

async function fetchInvitations(searchParams: any) {
  const fallback = { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };

  try {
    const page = Math.max(1, parseInt(searchParams?.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams?.limit || '20', 10)));
    const search = searchParams?.search || undefined;
    const status = searchParams?.status || undefined;
    const sort = searchParams?.sort || 'createdAt';
    const sortOrder = searchParams?.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const skip = (page - 1) * limit;
    const where: Prisma.InvitationWhereInput = { deletedAt: null };

    if (status && Object.values(InvitationStatus).includes(status as InvitationStatus)) {
      where.status = status as InvitationStatus;
    }

    if (search) {
      where.OR = [
        { groomName: { contains: search, mode: 'insensitive' } },
        { brideName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search } },
        { slugs: { some: { slug: { contains: search, mode: 'insensitive' }, isCurrent: true } } }
      ];
    }

    const validSortFields = ['createdAt', 'updatedAt', 'weddingDate', 'groomName', 'brideName', 'status'];
    const orderByField = validSortFields.includes(sort) ? sort : 'createdAt';

    const [items, total] = await Promise.all([
      prisma.invitation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
        include: {
          slugs: { where: { isCurrent: true }, select: { slug: true } },
          template: { select: { id: true, name: true, slug: true } }
        }
      }),
      prisma.invitation.count({ where })
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return fallback;
  }
}

export default async function AdminInvitationsListPage({ searchParams }: { searchParams: any }) {
  const data = await fetchInvitations(searchParams);
  const { items, pagination } = data;

  const getStatusBadge = (inv: any) => {
    const isExpired = inv.status === 'EXPIRED' || (inv.expiresAt && new Date() > new Date(inv.expiresAt));
    if (isExpired) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-bold">EXPIRED ⛔</span>;
    }
    switch(inv.status) {
      case 'ACTIVE': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">ACTIVE</span>;
      case 'PENDING_REVIEW': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">PENDING</span>;
      case 'DRAFT': return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">DRAFT</span>;
      default: return <span className="px-2 py-1 bg-stone-100 text-stone-800 text-xs rounded-full">{inv.status}</span>;
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Invitations</h1>
        <QuickCreateModal apiToken={cookies().get('admin_session')?.value || ''} />
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <form className="flex-1 flex gap-2">
            <input 
              name="search" 
              defaultValue={searchParams.search}
              placeholder="Search by phone, name, or slug..." 
              className="flex-1 p-2 border rounded"
            />
            <button className="px-4 py-2 bg-stone-900 text-white rounded font-bold">Search</button>
          </form>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[600px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-sm">Couple</th>
              <th className="p-4 font-semibold text-sm">Phone</th>
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm">Wedding Date</th>
              <th className="p-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((inv: any) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <p className="font-bold">{inv.groomName} & {inv.brideName}</p>
                  <p className="text-xs text-gray-500">/{inv.slugs[0]?.slug}</p>
                </td>
                <td className="p-4 text-sm text-gray-600">{inv.customerPhone}</td>
                <td className="p-4">{getStatusBadge(inv)}</td>
                <td className="p-4 text-sm text-gray-600">
                  {inv.weddingDate ? new Date(inv.weddingDate).toISOString().split('T')[0] : 'N/A'}
                </td>
                <td className="p-4">
                  <Link href={`/admin/invitations/${inv.id}`} className="text-blue-600 hover:underline font-semibold text-sm">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
