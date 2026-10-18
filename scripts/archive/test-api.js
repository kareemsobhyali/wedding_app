async function test() {
  const apiUrl = 'http://localhost:4000/api/v1';
  
  console.log('1. Starting draft...');
  const res = await fetch(`${apiUrl}/public/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateId: 'heavenly-roses' })
  });
  
  const cookieHeader = res.headers.get('set-cookie');
  console.log('Set-Cookie:', cookieHeader);
  const data = await res.json();
  console.log('Response:', data);
  
  let draftSessionCookie = '';
  if (cookieHeader) {
    draftSessionCookie = cookieHeader.split(';')[0];
  }
  
  console.log('2. Fetching draft...');
  const draftRes = await fetch(`${apiUrl}/public/invitations/draft`, {
    headers: {
      'Cookie': draftSessionCookie
    }
  });
  
  const draftData = await draftRes.json();
  console.log('Draft Data keys:', Object.keys(draftData));
  console.log('Draft Data.data keys:', draftData.data ? Object.keys(draftData.data) : 'undefined');
  console.log('Draft template slug:', draftData.data?.template?.slug || draftData.template?.slug);
}

test().catch(console.error);
