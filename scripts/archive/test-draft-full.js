async function test() {
  const apiUrl = 'http://localhost:4000/api/v1';
  
  const res = await fetch(`${apiUrl}/public/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateId: 'heavenly-roses' })
  });
  const data = await res.json();
  console.log("Start Draft Output:", data);
  const token = data.draftSessionToken; // Wait, data is { success: true, data: { ... } }!!!
  
  if (!token && !data.data?.draftSessionToken) {
    console.log("No token received from startDraft!", data);
    return;
  }
  
  const realToken = token || data.data.draftSessionToken;
  
  const draftRes = await fetch(`${apiUrl}/public/invitations/draft`, {
    headers: { 'Authorization': `Bearer ${realToken}` }
  });
  
  const draftData = await draftRes.json();
  console.log("Draft response ok?", draftRes.ok);
  console.log("Keys:", Object.keys(draftData));
  if (draftData.data) {
    console.log("Template:", draftData.data.template);
  } else {
    console.log("Error:", draftData);
  }
}

test();
