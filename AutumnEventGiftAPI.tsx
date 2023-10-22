import axios, { AxiosResponse, CancelToken } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as amplitude from '../AmplitudeAPI'

// DailyReportDto.Response 타입 정의
interface CheckResponse {
    // kakaoId: string; // 이거 아마 아예 안할듯!
    amount: number;
  }
  
  interface BuyResponse {
    // id: string; // 아마 안할듯! -> 근데 이거는 서버에 저장할 용도로는 쓸수도 있음 ... 같이 얘기해봐용
    // kakaoId: string; // 아마 안할듯!
    result: boolean;
    // imageUrl: string; // 이거 필요없지?
  }
  
  async function getAmount(key){
    const url = `http://3.34.55.218:5000/${key}/check`;

    try {
        const response: AxiosResponse<CheckResponse> = axios.get(url);

        return response.data.amount
    } catch(error) {
        amplitude.test1()//기프티콘 수량 가져오기 실패
        if (axios.isCancel(error)) {
            console.log('Request canceled');
        } else {
            throw new Error(`Failed to get amount of ${key}`);
        }
    }
  }

  async function buyGift(key){
    const url = `http://3.34.55.218:5000/${key}/buy`;

    try {
        const response: AxiosResponse<BuyResponse> = axios.get(url);

        return response.data.result
    } catch(error) {
        amplitude.test1()//기프티콘 수량 가져오기 실패
        if (axios.isCancel(error)) {
            console.log('Request canceled');
        } else {
            throw new Error(`Failed to buy ${key}`);
        }
    }
  }
  
  export { getAmount, buyGift };