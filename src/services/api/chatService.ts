const API_URL = 'http://localhost:8080/api/chat';

export async function askAiConcierge(userMessage: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Lỗi khi kết nối Chatbot Backend:', error);
    return 'Dạ, hiện đường truyền tới chuyên viên AI đang gián đoạn. Quý khách vui lòng thử lại sau ít phút.';
  }
}