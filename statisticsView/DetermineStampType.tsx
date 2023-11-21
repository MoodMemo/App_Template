import axios, { AxiosResponse, CancelToken } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Amplify } from 'aws-amplify';
import * as amplitude from '../AmplitudeAPI'

interface StampRequest {
  stamp: string; // '2023-08-06' 으로 보내는 중
}

// DailyReportDto.Request 타입 정의
interface StampResponse {
  result: string; // 이것도 안보내줘도 됨!
}

async function sendStamp(toAI: StampRequest, cancelToken: CancelToken): Promise<StampResponse> {
  const url = 'http://3.39.118.25:5000/stamp';

  console.log('cancel : ', cancelToken);
  try {
    // TODO - 여기까지 들어오기는 하는데 그 다음이 안됨
    const response: AxiosResponse<StampResponse> = await axios.post(url, toAI, { cancelToken });
    // const response: AxiosResponse<DailyReportResponse> = await axios.post(url, toAI);

    // 서버 응답 데이터를 반환합니다.
    return response.data;
  } catch (error) {
    amplitude.failToConnectAIServer(error);
    if (axios.isCancel(error)) {
      console.log('Request canceled');
    } else {
        if(error.response){
            console.log(error.response.data);
        }
      throw new Error('Failed to send stamp.');
    }
  }
}

export default sendStamp;
export { StampRequest, StampResponse };