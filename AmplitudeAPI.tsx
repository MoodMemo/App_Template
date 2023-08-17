import * as amplitude from '@amplitude/analytics-react-native';

// import * as amplitude from './AmplitudeAPI';


/* splash */
function AmplitudeInit() {
  amplitude.init('71c6aec47b758215ad5b07a0241099c8');
}
export default AmplitudeInit;


/* submit information */
export function submitInfo(section: String) {
  amplitude.track('subimt information');
  // TODO - value = section   
}
// TODO - 입력 필수 관련 붙여야 함


/* navigator */
export function beginSession() {
  amplitude.track('move to HOME');           
}
export function moveToHome() {
  amplitude.track('move to HOME');           
}
export function moveToWeekly() {
  amplitude.track('move to WEEKLY');           
}
export function moveToSetting() {
  amplitude.track('move to SETTING');           
}
export function moveToStatistics() {
  amplitude.track('move to SETTING');           
}


/* AnimatedViewBirthDay view */
export function userRegiStart() {
  amplitude.track('move to SETTING');           
}
export function userRegiName() {
  amplitude.track('move to SETTING');           
}
export function userRegiBirthday() {
  amplitude.track('move to SETTING');           
}
export function userRegiJob_Fin() {
  amplitude.track('move to SETTING');           
}
/* AnimatedViewBirthDay view */
export function userRegiFinish() {
  amplitude.track('move to SETTING');           
} // TODO - @이준하 -> 얘는 안쓰는앤가요?


/* home(stamp) view */
export function showCustomStampList() {
  amplitude.track('weekly: click another day');           
}
export function deleteCustomStamp() {
  amplitude.track('weekly: click another day');           
}
export function choiceDeleteCustomStampCandidate() {
  amplitude.track('weekly: click another day');           
}
export function tryAddCustomStamp() {
  amplitude.track('weekly: click another day');           
}
export function submitAddCustomStamp() {
  amplitude.track('weekly: click another day');           
}
export function exitCustomStampList() {
  amplitude.track('weekly: click another day');           
}
export function pushStamp() {
  // tODO -> 스탬프 이름 받자
  amplitude.track('weekly: click another day');           
}
export function tryChangeStampTime() {
  amplitude.track('weekly: click another day');           
}
export function submitChangeStampTime() {
  amplitude.track('weekly: click another day');           
}
export function cancelChangeStampTime() {
  amplitude.track('weekly: click another day');           
}
export function editStampMemo() {
  amplitude.track('weekly: click another day');           
}
export function submitStamp() {
  amplitude.track('weekly: click another day');           
}
export function cancelStamp() {
  amplitude.track('weekly: click another day');           
}
// TODO - 정렬 방식 변경은 추후 업데이트에 포함될 예정



/* weekly view */
export function changeToday() {
  console.log('go amplitude!');
  amplitude.track('weekly: click another day');           
}
export function clickDropDown() {
  amplitude.track('change year');           
}
export function changeYear() {
  amplitude.track('change year');           
}
export function changeMonth() {
  amplitude.track('change month');           
}
export function changeWeek() {
  amplitude.track('change week');           
}

export function showDetailModal() {
  amplitude.track('show detail modal');           
}
export function backToWeeklyFromDetailModal() {
  amplitude.track('push close button to detail modal');           
}
export function addNewStampInDetailModal() {
  amplitude.track('add new Stamp in detail modal');           
}

export function editAIDiary() {
  amplitude.track('edit diary');           
}
export function cancelToEditDiary() {
  amplitude.track('cancel editing diary');           
}
export function saveEditedDiary() {
  amplitude.track('save edited diary');           
}
export function editTitle() {
  amplitude.track('edit title');
}
export function editBodyText() {
  amplitude.track('edit body text');
}

export function tryGenerateAIDiary_cannot() {
  amplitude.track('try generate AI diary');
}
export function backToWeeklyFromCannotModal() {
  amplitude.track('back to weekly from cannot modal');
}
export function tryGenerateAIDiary_can() {
  amplitude.track('try generate AI diary');
}
export function waitingForAIDiary() {
  amplitude.track('waiting for AI diary');
}
export function backToWeeklyFromCanModal() {
  amplitude.track('back to weekly from can modal');
}


/* setting view */
export function intoProfile() {
  amplitude.track('save edited diary');           
}
export function setProfileName() {
  amplitude.track('save edited diary');           
}
export function setProfileBirthday() {
  amplitude.track('save edited diary');           
}
export function setProfileJob() {
  amplitude.track('save edited diary');           
}
export function saveNewProfile() {
  amplitude.track('save edited diary');           
}
export function cancelToChangeProfile() { // backdrop 역시 같음
  amplitude.track('save edited diary');           
}
export function connectToKakaoChatBot() { // backdrop 역시 같음
  amplitude.track('save edited diary');           
}
export function notiONtoOFF() { // backdrop 역시 같음
  amplitude.track('save edited diary');           
}
export function notiOFFtoON() { // backdrop 역시 같음
  amplitude.track('save edited diary');           
}
export function notiONwhenPermissionDenied() { // TODO - amplitude
  amplitude.track('save edited diary');           
}
export function intoNotiList() { // backdrop 역시 같음
  amplitude.track('save edited diary');
}
export function intoAddNewNoti() { // backdrop 역시 같음
  amplitude.track('save edited diary');           
}
export function saveNewNoti() { // 알림 시각 받기
  amplitude.track('save edited diary');           
}
export function saveDuplicatedNoti() { // TODO - amplitude
  amplitude.track('save edited diary');           
}
export function cancelNewNoti() { // backdrop 역시 같음
  amplitude.track('save edited diary');           
}
export function intoRenewNoti() { // backdrop 역시 같음
  amplitude.track('save edited diary');           
}
export function saveRenewNoti() { // 알림 시각(기존, 이후) 받기
  amplitude.track('save edited diary');           
}
export function cancelRenewNoti() { // backdrop 역시 같음
  amplitude.track('save edited diary');           
}
export function deleteNoti() { // 알림 시각 받기
  amplitude.track('save edited diary');           
}
export function outToSettingFromNotiList() { // TODO - amplitude
  amplitude.track('save edited diary');
}
export function intoGuide() { // 알림 시각 받기
  amplitude.track('save edited diary');           
}
export function outToSettingFromGuide() { // 알림 시각 받기
  amplitude.track('save edited diary');           
}
export function intoServiceCenter() { // 알림 시각 받기
  amplitude.track('save edited diary');           
}
export function outToSettingFromServiceCenter() { // 알림 시각 받기
  amplitude.track('save edited diary');           
}
export function intoCoffee() { // 알림 시각 받기
  amplitude.track('save edited diary');           
}
export function outToSettingFromCoffee() { // 알림 시각 받기
  amplitude.track('save edited diary');           
}
