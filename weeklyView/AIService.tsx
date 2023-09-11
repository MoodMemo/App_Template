import axios, { AxiosResponse, CancelToken } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Amplify } from 'aws-amplify';
import * as amplitude from '../AmplitudeAPI'

// DailyReportDto.Response 타입 정의
interface SendAI {
  // kakaoId: string; // 이거 아마 아예 안할듯!
  userName: string;
  age: number; // birthday 기준으로 만나이 계산해서 넣을듯!
  gender: string; // 얘는 받을지 말지 고민해야함!
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
  today: string; // '2023-08-06' 으로 보내는 중
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
  // likeCnt: number; // 안할듯!  -> 근데 이거는 서버에 저장할 용도로는 쓸수도 있음 ... 같이 얘기해봐용
}

async function sendDailyReport(toAI: DailyReportRequest, cancelToken: CancelToken): Promise<DailyReportResponse> {
  const url = 'http://3.39.118.25:5000/dailyReport';

  console.log('cancel : ', cancelToken);
  try {
    // TODO - 여기까지 들어오기는 하는데 그 다음이 안됨
    const response: AxiosResponse<DailyReportResponse> = await axios.post(url, toAI, { cancelToken });
    // const response: AxiosResponse<DailyReportResponse> = await axios.post(url, toAI);

    // 서버 응답 데이터를 반환합니다.
    return response.data;
  } catch (error) {
    amplitude.failToConnectAIServer(error);
    if (axios.isCancel(error)) {
      console.log('Request canceled');
    } else {
      throw new Error('Failed to send daily report.');
    }
  }
}

export default sendDailyReport;
export { DailyReportRequest, DailyReportResponse };

export async function getUserAsync() : Promise<SendAI> {
  const birth = await AsyncStorage.getItem('@UserInfo:birth');
        if (birth !== null) {
          // value previously stored
          console.log("birth: " + birth);
        }
  const job = await AsyncStorage.getItem('@UserInfo:job');
  if (job !== null) {
    // value previously stored
    console.log("job: " + job);
  }
  return {
    userName: "테스트 사용자 이름! -> 아직 인트로에서 안받음",
    age: new Date(new Date().getTime() - new Date(birth!).getTime()).getFullYear() - 1970,
    gender: "남자", // -> 아직 인트로에서 안받음
    job: job!,
  }
}