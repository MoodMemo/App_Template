import * as amplitude from '@amplitude/analytics-react-native';

// import * as amplitude from './AmplitudeAPI';


/* splash */
function AmplitudeInit() {
  amplitude.init('71c6aec47b758215ad5b07a0241099c8');
}
export default AmplitudeInit;


/* submit information */ // 얘 왜 만들었더라
export function submitInfo(section: String) {
  amplitude.track('subimt information');
  // TODO - value = section   
}
// TODO - 입력 필수 관련 붙여야 함


/* navigator */
export function beginSession() {
  amplitude.track('START');           
}
export function moveToHome() {
  amplitude.track('stamp:');           
}
export function moveToWeekly() {
  amplitude.track('weekly:');           
}
export function moveToSetting() {
  amplitude.track('setting:');           
}
export function moveToStatistics() {
  amplitude.track('statistics:');           
}


/* AnimatedViewBirthDay view */
export function userRegiStart() {
  amplitude.track('intro: submit start');
}
export function userRegiName() {
  amplitude.track('intro: submit name');        
}
export function userRegiBirthday() {
  amplitude.track('intro: submit birthday');        
}
export function userRegiJob_Fin() {
  amplitude.track('intro: submit job');    
}
/* AnimatedViewBirthDay view */
export function userRegiFinish() {
  amplitude.track('intro: move to main view');         
} // TODO - @이준하 -> 얘는 안쓰는앤가요?


/* home(stamp) view */
export function showCustomStampList() {
  amplitude.track('stamp: into - custom stamp list');
}
export function deleteCustomStamp() {
  amplitude.track('stamp: delete custom stamp');      
}
export function choiceDeleteCustomStampCandidate() {
  amplitude.track('stamp: choice delete custom stamp candidate');
}
export function tryAddCustomStamp() {
  amplitude.track('stamp: into - add custom stamp');
}
export function submitAddCustomStamp() {
  amplitude.track('stamp: submit - add custom stamp');
}
export function exitCustomStampList() {
  amplitude.track('stamp: exit - custom stamp list');
}
export function pushStamp() {
  // tODO -> 스탬프 이름 받자
  amplitude.track('stamp: push stamp');       
}
export function tryChangeStampTime() {
  amplitude.track('stamp: try to change stamp time');
}
export function submitChangeStampTime() {
  amplitude.track('stamp: submit change stamp time');     
}
export function cancelChangeStampTime() {
  amplitude.track('stamp: cancel change stamp time');     
}
export function editStampMemo() {
  amplitude.track('stamp: edit stamp memo');     
}
export function submitStamp() {
  amplitude.track('stamp: submit stamp');
}
export function cancelStamp() {
  amplitude.track('stamp: cancel stamp');
}
// TODO - 정렬 방식 변경은 추후 업데이트에 포함될 예정


/* weekly view */
export function changeToday() {
  amplitude.track('weekly: click another day');           
}
export function clickDropDown() {
  amplitude.track('weekly: click drop down');
}
export function changeYear() {
  amplitude.track('weekly: change year');           
}
export function changeMonth() {
  amplitude.track('weekly: change month');           
}
export function changeWeek() {
  amplitude.track('weekly: change week');           
}

export function showDetailModal() {
  amplitude.track('weekly: into - detail modal');           
}
export function backToWeeklyFromDetailModal() {
  amplitude.track('weekly: exit - detail modal');
}
export function addNewStampInDetailModal() {
  amplitude.track('weekly: push new stamp in detail modal');           
}

export function editAIDiary() {
  amplitude.track('weekly: edit diary');           
}
export function cancelToEditDiary() {
  amplitude.track('weekly: cancel editing diary');           
}
export function saveEditedDiary() {
  amplitude.track('weekly: save edited diary');           
}
export function editTitle() {
  amplitude.track('weekly: edit title');
}
export function editBodyText() {
  amplitude.track('weekly: edit body text');
}

export function tryGenerateAIDiary_cannot() {
  amplitude.track('weekly: into - generate AI diary (cannot)');
}
export function backToWeeklyFromCannotModal() {
  amplitude.track('weekly: exit - cannot modal (fail to generate AI diary)');
}
export function tryGenerateAIDiary_can() {
  amplitude.track('weekly: into - generate AI diary (can)'); 
}
export function waitingForAIDiary() {
  amplitude.track('weekly: waiting for AI diary');
}
export function backToWeeklyFromCanModal() {
  amplitude.track('weekly: exit - can modal (finish generating AI diary)');
}


/* setting view */
export function intoProfile() {
  amplitude.track('setting: click profile');
}
export function setProfileName() {
  amplitude.track('setting: edit profile name');
}
export function setProfileBirthday() {
  amplitude.track('setting: edit profile birthday');  
}
export function setProfileJob() {
  amplitude.track('setting: edit profile job');
}
export function saveNewProfile() {
  amplitude.track('setting: save new profile');    
}
export function cancelToChangeProfile() { // backdrop 역시 같음
  amplitude.track('setting: cancel to change profile');  
}
export function connectToKakaoChatBot() { // backdrop 역시 같음
  amplitude.track('setting: try to kakao chat bot');
}
export function notiONtoOFF() { // backdrop 역시 같음
  amplitude.track('setting: turn off notification');
}
export function notiOFFtoON() { // backdrop 역시 같음
  amplitude.track('setting: turn on notification');
}
export function notiONwhenPermissionDenied() { // TODO - amplitude
  amplitude.track('setting: turn on notification (permission denied)');
}
export function intoNotiList() { // backdrop 역시 같음
  amplitude.track('setting: click notification list');
}
export function intoAddNewNoti() { // backdrop 역시 같음
  amplitude.track('setting: try to add new notification');
}
export function saveNewNoti() { // 알림 시각 받기
  amplitude.track('setting: save new notification');
}
export function saveDuplicatedNoti() { // TODO - amplitude
  amplitude.track('setting: save duplicated notification');
}
export function cancelNewNoti() { // backdrop 역시 같음
  amplitude.track('setting: cancel to add new notification');
}
export function intoRenewNoti() { // backdrop 역시 같음
  amplitude.track('setting: try to edit notification');
}
export function saveRenewNoti() { // 알림 시각(기존, 이후) 받기
  amplitude.track('setting: save edited notification');
}
export function cancelRenewNoti() { // backdrop 역시 같음
  amplitude.track('setting: cancel to edit notification');
}
export function deleteNoti() { // 알림 시각 받기
  amplitude.track('setting: delete notification');
}
export function outToSettingFromNotiList() { // TODO - amplitude
  amplitude.track('setting: close notification list');
}
export function intoGuide() {
  amplitude.track('setting: click guide');
}
export function outToSettingFromGuide() { 
  amplitude.track('setting: close guide');        
}
export function intoServiceCenter() {
  amplitude.track('setting: click service center');           
}
export function outToSettingFromServiceCenter() { 
  amplitude.track('setting: close service center');
}
export function intoCoffee() { 
  amplitude.track('setting: click coffee');
}
export function outToSettingFromCoffee() { 
  amplitude.track('setting: close coffee');       
}
