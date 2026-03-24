async function testPostEvent() {
  try {
    const eventData = {
      title: 'Future Event 2026',
      description: 'This is in the future',
      category: 'Workshop',
      date: '2026-12-31',
      address: 'Anna University, Chennai',
      longitude: 80.2376,
      latitude: 13.0102,
      collegeName: 'Anna University',
      link: 'https://annauniv.edu',
      poster: ''
    };

    const response = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });
    
    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);
  } catch (err) {
    console.error('Error fetching:', err.message);
  }
}

testPostEvent();
