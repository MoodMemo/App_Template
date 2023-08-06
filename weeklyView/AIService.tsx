import axios, { AxiosResponse } from 'axios';

// DailyReportDto.Response 타입 정의
interface SendAI {
  // kakaoId: string; // 이거 아마 아예 안할듯!
  userName: string;
  age: number; // birthday 기준으로 만나이 계산해서 넣을듯!
  gender: '여자' | '남자'; // 얘는 받을지 말지 고민해야함!
  job: string;
}

interface Stamps {
  // id: string; // 아마 안할듯! -> 근데 이거는 서버에 저장할 용도로는 쓸수도 있음 ... 같이 얘기해봐용
  // kakaoId: string; // 아마 안할듯!
  dateTime: Date;
  stampName: string;
  memo: string;
  // imageUrl: string; // 이거 필요없지?
}

interface DailyReportRequest {
  userDto: SendAI;
  todayStampList: Stamps[];
}

// DailyReportDto.Request 타입 정의
interface DailyReportResponse {
  username: string; // 이것도 안보내줘도 됨!
  date: string; // '2023-08-06' 으로 보내주세용
  title: string;
  bodytext: string;
  keyword: string[]
  time: string; // 없어도 됨!
  // likeCnt: number; // 안할듯!
}

async function sendDailyReport(toAI: DailyReportRequest): Promise<DailyReportResponse> {
  const url = 'http://3.39.118.25:5000/journal';

  try {
    const response: AxiosResponse<DailyReportResponse> = await axios.post(url, toAI);

    // 서버 응답 데이터를 반환합니다.
    return response.data;
  } catch (error) {
    // 에러 처리를 해줍니다.
    throw new Error('Failed to send daily report.');
  }
}