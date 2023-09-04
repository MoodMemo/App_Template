import * as amplitude from '@amplitude/analytics-react-native';

// import * as amplitude from './AmplitudeAPI';


/* splash */
function AmplitudeInit() {
  // amplitude.init('71c6aec47b758215ad5b07a0241099c8'); // real key
  amplitude.init('31330863767122049d66767a71e34f09'); // fake key
}
export default AmplitudeInit;


/* navigator */
export function beginSession() {
  amplitude.track('START');           
}
export function moveToHome() {
  amplitude.track('stamp:',
  {
    view: 'stamp',});          
}
export function moveToWeekly() {
  amplitude.track('weekly:', 
  {
    view: 'weekly',});           
}
export function moveToSetting() {
  amplitude.track('setting:',
  {
    view: 'setting',});
    // @이준하 -> 로깅 안되는 부분 해결해주세요 ! + 시작할 때 뜨는 것도 확인바람!
}
export function moveToStatistics() {
  amplitude.track('statistics:',
  {
    view: 'statistics',});           
}


/* AnimatedViewBirthDay view */ // TODO - 밑에 있는 친구들 싹 확인한 뒤에 마지막으로 체크할 것
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
export function submitAddCustomStamp(stampName: String) {
  amplitude.track('stamp: submit - add custom stamp', { stampName });
}
export function cancelAddCustomStamp() {
  amplitude.track('stamp: cancel - add custom stamp');
}
export function exitCustomStampList() {
  amplitude.track('stamp: exit - custom stamp list');
}
export function pushStamp(stampName: String) { // TODO - 여기부터 다시!
  // tODO -> 스탬프 이름 받자
  amplitude.track('stamp: push stamp', { stampName });       
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
export function changeToday(today: String) {
  amplitude.track('weekly: confirm, today', 
  {
    view: 'weekly',
    action: 'confirm',
    today});           
}
export function clickDropDown() {
  amplitude.track('weekly: click, dropdown', 
  {
    view: 'weekly',
    action: 'click'});
}
export function changeYear() {
  amplitude.track('weekly: confirm, year', 
  {
    view: 'weekly',
    action: 'confirm',
  });
}
export function changeMonth() {
  amplitude.track('weekly: confirm, month', 
  {
    view: 'weekly',
    action: 'confirm',
  });
}
export function changeWeek() {
  amplitude.track('weekly: confirm, week', 
  {
    view: 'weekly',
    action: 'confirm',
  });
}
export function showDetailModal(today: String) {
  amplitude.track('weekly: click, detail modal', 
  {
    view: 'weekly',
    action: 'click',
    today});   
}
export function backToWeeklyFromDetailModal() {
  amplitude.track('weekly: cancel, detail modal, back to weekly', 
  {
    view: 'weekly',
    action: 'cancel',});
}
export function addNewStampInDetailModal() { // developing yet
  amplitude.track('weekly: click, new stamp, in detail modal', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'detail modal',});
}
export function editAIDiary(today: String) {
  amplitude.track('weekly: click, edit diary', 
  {
    view: 'weekly',
    action: 'click',});
}
export function cancelToEditDiary() {
  amplitude.track('weekly: click, cancel to edit diary', 
  {
    view: 'weekly',
    action: 'cancel',});     
}
export function saveEditedDiary(today: String) {
  amplitude.track('weekly: confirm, edit diary', 
  {
    view: 'weekly',
    action: 'confirm',});
}
export function editTitle() {
  amplitude.track('weekly: click, title, in edit diary', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'edit diary',}); 
}
export function editBodyText() {
  amplitude.track('weekly: click, body text, in edit diary', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'edit diary',});
}
export function clickKeyword() {
  amplitude.track('weekly: click, keyword, in edit diary', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'edit diary',
    status: 'not yet'  });
}
export function confirmCancelEditingDiary(today: String) {
  amplitude.track('weekly: confirm, cancel, in edit diary', 
  {
    view: 'weekly',
    action: 'confirm',
    secondView: 'edit diary',});
}
export function cancelCancelEditingDiary() {
  amplitude.track('weekly: cancel, cancel, in edit diary', 
  {
    view: 'weekly',
    action: 'cancel',
    secondView: 'edit diary',});
}
export function click2move2AnotherDayWhileEditingDiary(moveAnotherDay: String) {
  amplitude.track('weekly: click, move another day, in edit diary', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'edit diary',
    moveAnotherDay});
}
export function cancel2move2AnotherDayWhileEditingDiary() {
  amplitude.track('weekly: cancel, move another day, in edit diary', 
  {
    view: 'weekly',
    action: 'cancel',
    secondView: 'edit diary',});
}
export function move2AnotherDayWhileEditingDiary(moveAnotherDay: String) {
  amplitude.track('weekly: confirm, move another day, in edit diary', 
  {
    view: 'weekly',
    action: 'confirm',
    secondView: 'edit diary',
    moveAnotherDay});
}
export function tryGenerateAIDiary_cannot(today: String) {
  amplitude.track('weekly: click, generate AI diary (cannot)', 
  {
    view: 'weekly',
    action: 'click',
    today});
}
export function backToWeeklyFromCannotModal() {
  amplitude.track('weekly: cancel, fail to generate AI diary modal, back to weekly)', 
  {
    view: 'weekly',
    action: 'cancel',});
}
export function tryGenerateAIDiary_can(today: String) {
  amplitude.track('weekly: click, generate AI diary (can)', 
  {
    view: 'weekly',
    action: 'click',
    today}); 
}
export function waitingForAIDiary() {
  // 여기에 날짜 받으면 에러나니까 절대 네버 넣지 말것 ...!
  amplitude.track('weekly: click, wait for AI diary, in generate AI diary modal', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'generate AI diary modal',}); 
}
export function backToWeeklyFromCanModal(today: String) {
  amplitude.track('weekly: confirm, finish to generate AI diary', 
  {
    view: 'weekly',
    action: 'confirm',
    today});
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
export function saveNewNoti(notiTime: String) { // 알림 시각 받기
  amplitude.track('setting: save new notification', { notiTime });
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



export function test1() { 
  amplitude.track('** .then((response) => {');       
}
export function test2() { 
  amplitude.track('** realm.write(() => {');       
}
export function test3() { 
  amplitude.track('** .catch((error) => {');       
}
export function test4(error: any) { 
  amplitude.track('** if (axios.isCancel(error)) {', { error });       
}
export function test5(error: any) { 
  amplitude.track('** else {', { error });       
}

export function test6() { 
  amplitude.track('** sendDailyReport(toAI: Da');       
}
export function test7() { 
  amplitude.track('** try {');       
}
export function failToConnectAIServer(error: any) { 
  amplitude.track('weekly: ERROR ! cannot connect with ai server', { error });       
}
export function test9(error: any) { 
  amplitude.track('** if (axios.isCancel(error)) {', { error });       
}
export function test10() { 
  amplitude.track('**} else {');       
}

export function test11(memo: string) {
  amplitude.track('** realm.write(() => {', {memo});       
}

