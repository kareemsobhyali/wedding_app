import React from 'react';
import { cookies } from 'next/headers';
import QuickCreateModal from './QuickCreateModal';
import AdminInvitationsTable from './AdminInvitationsTable';
import { prisma } from '@/lib/prisma';
import { InvitationStatus, Prisma } from '@prisma/client';
import { Search, Mail, Sparkles, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function fetchInvitations(searchParams: any) {
  const fallback = { items: [], pagination: { page: 1, limit: 100, total: 0, totalPages: 0 } };

  try {
    const page = Math.max(1, parseInt(searchParams?.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams?.limit || '100', 10)));
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
      items: JSON.parse(JSON.stringify(items)),
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
  const apiToken = cookies().get('admin_session')?.value || '';

  const activeStatus = searchParams?.status || 'ALL';

  return (
    <div className="space-y-6">
      
      {/* Page Title & Add Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EADBCA]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF0D7] text-[#8C6D38] flex items-center justify-center border border-[#DFBA73]/40 shadow-xs">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#38260F]" style={{ fontFamily: "'Aref Ruqaa', serif" }}>
              إدارة دعوات الزفاف
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              إجمالي {pagination.total} دعوة مسجلة في المنصة
            </p>
          </div>
        </div>

        <QuickCreateModal apiToken={apiToken} />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#EADBCA] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs font-bold">
          <a
            href="/admin/invitations"
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeStatus === 'ALL'
                ? 'bg-[#8C6D38] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#6E4E26] hover:bg-[#F2ECE1] border border-[#EADBCA]'
            }`}
          >
            الكل ({pagination.total})
          </a>
          <a
            href="/admin/invitations?status=ACTIVE"
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeStatus === 'ACTIVE'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-[#FAF7F2] text-gray-600 hover:bg-[#F2ECE1] border border-[#EADBCA]'
            }`}
          >
            نشطة
          </a>
          <a
            href="/admin/invitations?status=PENDING_REVIEW"
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeStatus === 'PENDING_REVIEW'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-[#FAF7F2] text-gray-600 hover:bg-[#F2ECE1] border border-[#EADBCA]'
            }`}
          >
            قيد المراجعة
          </a>
          <a
            href="/admin/invitations?status=EXPIRED"
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeStatus === 'EXPIRED'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-[#FAF7F2] text-gray-600 hover:bg-[#F2ECE1] border border-[#EADBCA]'
            }`}
          >
            منتهية الصلاحية
          </a>
        </div>

        {/* Search Input */}
        <form className="w-full md:w-72 relative">
          <input 
            name="search" 
            defaultValue={searchParams?.search || ''}
            placeholder="بحث بالاسم، الهاتف، أو الرابط..." 
            className="w-full bg-[#FAF7F2] border border-[#EADBCA] focus:bg-white focus:border-[#8C6D38] rounded-xl py-2 px-3 pr-8 text-xs sm:text-sm outline-none transition-all shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 right-2.5 pointer-events-none" />
        </form>

      </div>

      {/* Invitations Table & Mobile Cards */}
      <AdminInvitationsTable initialItems={items} apiToken={apiToken} />

    </div>
  );
}
