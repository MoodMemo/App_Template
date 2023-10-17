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

export function clickTopBarNoti() {
  amplitude.track('click, top bar noti',
  {
    view: 'top bar',
    action: 'click',});
}

export function codePushUpdating() {
  amplitude.track('codePush: updating');
}


/* AnimatedViewBirthDay view */ // TODO - 밑에 있는 친구들 싹 확인한 뒤에 마지막으로 체크할 것
export function userRegiStart() {
  amplitude.track('intro: confirm, start',
  {
    view: 'intro',
    action: 'confirm',});
}
export function userRegiName(name: String) {
  amplitude.track('intro: confirm, name',
  {
    view: 'intro',
    action: 'confirm',
    name});
}
export function userRegiBirthday(birthday: String) {
  amplitude.track('intro: confirm, birthday',
  {
    view: 'intro',
    action: 'confirm',
    birthday});
}
export function userRegiJob_Fin(job: String) {
  amplitude.track('intro: confirm, job',
  {
    view: 'intro',
    action: 'confirm',
    job});
}
export function userRegiFin_andStampGo() {
  amplitude.track('intro: confirm, first stamp',
  {
    view: 'intro',
    action: 'confirm',});
}
/* AnimatedViewBirthDay view */
export function userRegiFinish() {
  amplitude.track('intro: move to main view');         
} // TODO - @이준하 -> 얘는 안쓰는앤가요?


/* home(stamp) view */
export function showCustomStampList() {
  amplitude.track('stamp: click, custom stamp list',
  {
    view: 'stamp',
    action: 'click',});
}
export function deleteCustomStamp() {
  amplitude.track('stamp: confirm, delete, in custom stamp list',
  {
    view: 'stamp',
    action: 'confirm',
    secondView: 'custom stamp list',});
}
export function choiceDeleteCustomStampCandidate() {
  amplitude.track('stamp: click, candidate to delete, in custom stamp list',
  {
    view: 'stamp',
    action: 'click',
    secondView: 'custom stamp list',});
}
export function tryAddCustomStamp() {
  amplitude.track('stamp: click, add new, in custom stamp list',
  {
    view: 'stamp',
    action: 'click',
    secondView: 'custom stamp list',});
}
export function submitAddCustomStamp(stampName: String) {
  amplitude.track('stamp: comfirm, add new, in custom stamp list', 
  { 
    view: 'stamp',
    action: 'confirm',
    secondView: 'custom stamp list',
    stampName });
}
export function cancelAddCustomStamp() {
  amplitude.track('stamp: cancel, add new, in custom stamp list',
  {
    view: 'stamp',
    action: 'cancel',
    secondView: 'custom stamp list',});
}
export function exitCustomStampList() {
  amplitude.track('stamp: cancel, custom stamp list, back to stamp',
  {
    view: 'stamp',
    action: 'cancel',});
}
export function pushStamp(stampName: String) {
  amplitude.track('stamp: click, stamp', 
  { 
    view: 'stamp',
    action: 'click',
    stampName });    
}
export function tryChangeStampTime() {
  amplitude.track('stamp: click, time, in push stamp',
  {
    view: 'stamp',
    action: 'click',
    secondView: 'push stamp',});
}
export function submitChangeStampTime() {
  amplitude.track('stamp: confirm, time, in push stamp',
  {
    view: 'stamp',
    action: 'confirm',
    secondView: 'push stamp',});     
}
export function cancelChangeStampTime() {
  amplitude.track('stamp: cancel, time, in push stamp',
  {
    view: 'stamp',
    action: 'cancel',
    secondView: 'push stamp',});     
}
export function editStampMemo() {
  amplitude.track('stamp: click, memo, in push stamp',
  {
    view: 'stamp',
    action: 'click',
    secondView: 'push stamp',});
}
export function submitStamp() { // 나중에는 여기도 스탬프 이름 받기
  amplitude.track('stamp: confirm, stamp',
  {
    view: 'stamp',
    action: 'confirm',});
}
export function cancelStamp() {
  amplitude.track('stamp: cancel, stamp',
  {
    view: 'stamp',
    action: 'cancel',});
}
export function confirmPushedStampFinModal() {
  amplitude.track('stamp: confirm, stamp, in finish modal',
  {
    view: 'stamp',
    action: 'confirm',
    secondView: 'finish modal',});
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
export function tryGenerateAIDiary_can_forPast(today: String) {
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
export function clickStampSwitchInStampView() {
  amplitude.track('weekly: click, stamp switch, in stamp view', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'stamp view',}); 
}
export function clickDiarySwitchInStampView() {
  amplitude.track('weekly: click, diary switch, in stamp view', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'stamp view',}); 
}
export function clickStampSwitchInDiaryView() {
  amplitude.track('weekly: click, stamp switch, in diary view', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'diary view',}); 
}
export function clickDiarySwitchInDiaryView() {
  amplitude.track('weekly: click, diary switch, in diary view', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'diary view',}); 
}
export function pushStampInTellMeYourDayView() {
  amplitude.track('weekly: click, stamp, in tell me your day view',
  {
    view: 'weekly',
    action: 'click',
    secondView: 'tell me your day view',});
}
export function pushStampInPleaseOneMoreStampView() {
  amplitude.track('weekly: click, stamp, in please one more stamp view',
  {
    view: 'weekly',
    action: 'click',
    secondView: 'please one more stamp view',});
}
export function pushStampInPleaseOneMoreStampViewInStampSwitch() {
  amplitude.track('weekly: click, stamp, in weekly-stamp-one-stamp',
  {
    view: 'weekly',
    action: 'click',
    secondView: 'weekly-stamp-one-stamp',});
}
export function editMemo() {
  amplitude.track('weekly: click, memo, in edit stamp', 
  {
    view: 'weekly',
    action: 'click',
    secondView: 'edit stamp',});
}
export function backToWeeklyFromStampEditModal(){
  amplitude.track('weekly: cancel, edit stamp, back to weekly', 
  {
    view: 'weekly',
    action: 'cancel',});
}
export function confirmToEditStamp() {
  amplitude.track('weekly: confirm, edit stamp, in edit stamp modal',
  {
    view: 'weekly',
    action: 'confirm',
    secondView: 'edit stamp modal',});
}
export function confirmToDeleteStamp() {
  amplitude.track('weekly: confirm, delete stamp',
  {
    view: 'weekly',
    action: 'confirm',});
}
export function cancelToDeleteStamp() {
  amplitude.track('weekly: cancel, delete stamp',
  {
    view: 'weekly',
    action: 'cancel',});
}
export function clickFuture() {
  amplitude.track('weekly: click, future date',
  {
    view: 'weekly',
    action: 'click',});
}
export function clickPast_noStamp() {
  amplitude.track('weekly: click, past date (no stamp)',
  {
    view: 'weekly',
    action: 'click',});
}
export function clickPast_noDiary() {
  amplitude.track('weekly: click, past date (no diary)',
  {
    view: 'weekly',
    action: 'click',});
}
export function clickFuture_Diary() {
  amplitude.track('weekly: click, future date (diary)',
  {
    view: 'weekly',
    action: 'click',});
}
export function clickStampDotButton() {
  amplitude.track('weekly: click, stamp dot button',
  {
    view: 'weekly',
    action: 'click',});
}
export function clickEditButton() {
  amplitude.track('weekly: click, edit button',
  {
    view: 'weekly',
    action: 'click',});
}
export function clickDeleteButton() {
  amplitude.track('weekly: click, delete button',
  {
    view: 'weekly',
    action: 'click',});
}
export function clickDeleteDiaryButton() {
  amplitude.track('weekly: click, delete diary button',
  {
    view: 'weekly',
    action: 'click',});
}
export function cancelToDeleteDiary() {
  amplitude.track('weekly: cancel, delete diary',
  {
    view: 'weekly',
    action: 'cancel',
    secondView: 'delete diary modal',});
}
export function confirmDeleteDiaryButton() {
  amplitude.track('weekly: confirm, delete diary',
  {
    view: 'weekly',
    action: 'confirm',
    secondView: 'delete diary modal',});
}
export function createDiaryMyself(today: String) {
  amplitude.track('weekly: confirm, create diary myself',
  {
    view: 'weekly',
    action: 'confirm',
    today});
}
export function createDiaryMyself_forPast(today: String) {
  amplitude.track('weekly: confirm, create diary myself',
  {
    view: 'weekly',
    action: 'confirm',
    today});
}
export function try_createDiaryMyself_forPast() {
  amplitude.track('weekly: click, create diary myself',
  {
    view: 'weekly',
    action: 'click',
    });
}
export function try_createDiaryMyself() {
  amplitude.track('weekly: click, create diary myself',
  {
    view: 'weekly',
    action: 'click',
    });
}


/* setting view */
export function intoProfile() {
  amplitude.track('setting: click, profile',
  {
    view: 'setting',
    action: 'click',});
}
export function setProfileName() {
  amplitude.track('setting: click, name, in profile',
  {
    view: 'setting',
    action: 'click',
    secondView: 'profile',});
}
export function setProfileBirthday() {
  amplitude.track('setting: click, birthday, in profile',
  {
    view: 'setting',
    action: 'click',
    secondView: 'profile',});  
}
export function setProfileJob() {
  amplitude.track('setting: click, job, profile',
  {
    view: 'setting',
    action: 'click',
    secondView: 'profile',});
}
export function saveNewProfile() {
  amplitude.track('setting: confirm, profile',
  {
    view: 'setting',
    action: 'confirm',});    
}
export function cancelToChangeProfile() { // backdrop 역시 같음
  amplitude.track('setting: cancel, profile',
  {
    view: 'setting',
    action: 'cancel',});  
}
export function connectToKakaoChatBot() { // backdrop 역시 같음
  amplitude.track('setting: click, kakao chat bot',
  {
    view: 'setting',
    action: 'click',});
}
export function notiONtoOFF() { // backdrop 역시 같음
  amplitude.track('setting: click, noti off',
  {
    view: 'setting',
    action: 'click',});
}
export function notiOFFtoON() { // backdrop 역시 같음
  amplitude.track('setting: click, noti on',
  {
    view: 'setting',
    action: 'click',});
}
export function notiONwhenPermissionDenied() { // TODO - amplitude
  amplitude.track('setting: click, noti on (permission denied)',
  {
    view: 'setting',
    action: 'click',
    status: 'permission ERROR',});
}
export function intoNotiList() { // backdrop 역시 같음
  amplitude.track('setting: click, notification',
  {
    view: 'setting',
    action: 'click',});
}
export function intoAddNewNoti() { // backdrop 역시 같음
  amplitude.track('setting: click, add new, in notification',
  {
    view: 'setting',
    action: 'click',
    secondView: 'notification',});
}
export function saveNewNoti(notiTime: String) { // 알림 시각 받기
  amplitude.track('setting: confirm, add new, in notification', {
    view: 'setting',
    action: 'confirm',
    secondView: 'notification', 
    notiTime });
}
export function saveDuplicatedNoti() { // TODO - amplitude
  amplitude.track('setting: confirm, duplicated, in notification',
  {
    view: 'setting',
    action: 'confirm',
    secondView: 'notification',
    status: 'validate ERROR',});
}
export function cancelNewNoti() { // backdrop 역시 같음
  amplitude.track('setting: cancel, add new, in notification',
  {
    view: 'setting',
    action: 'cancel',
    secondView: 'notification',});
}
export function intoRenewNoti() { // backdrop 역시 같음
  amplitude.track('setting: click, edit, in notification');
}
export function saveRenewNoti(notiTime: String) { // 알림 시각(기존, 이후) 받기
  amplitude.track('setting: confirm, edit, in notification',
  {
    view: 'setting',
    action: 'confirm',
    secondView: 'notification',
    notiTime,});
}
export function cancelRenewNoti() { // backdrop 역시 같음
  amplitude.track('setting: cancel, edit, in notification',
  {
    view: 'setting',
    action: 'cancel',
    secondView: 'notification',});
}
export function deleteNoti() { // 알림 시각 받기
  amplitude.track('setting: confirm, delete, in notification',
  {
    view: 'setting',
    action: 'confirm',
    secondView: 'notification',});
}
export function outToSettingFromNotiList() { // TODO - amplitude
  amplitude.track('setting: cancel, notification, back to setting',
  {
    view: 'setting',
    action: 'cancel',
  });
}
export function intoGuide() {
  amplitude.track('setting: click, guide',
  {
    view: 'setting',
    action: 'click',});
}
export function outToSettingFromGuide() { 
  amplitude.track('setting: cancel, guide, back to setting',
  {
    view: 'setting',
    action: 'cancel',});        
}
export function intoServiceCenter() {
  amplitude.track('setting: click, service center',
  {
    view: 'setting',
    action: 'click',});           
}
export function send2sentry(memo: string) {
  amplitude.track('setting: confirm, feedback, in service center', {
    view: 'setting',
    action: 'confirm',
    secondView: 'service center',
    memo});       
}
export function outToSettingFromServiceCenter() { 
  amplitude.track('setting: cancel, service center, back to setting',
  {
    view: 'setting',
    action: 'cancel',});
}
export function intoCoffee() { 
  amplitude.track('setting: click, coffee',
  {
    view: 'setting',
    action: 'click',});
}
export function outToSettingFromCoffee() { 
  amplitude.track('setting: cancel, coffee, back to setting',
  {
    view: 'setting',
    action: 'cancel',});       
}
export function clickReset() {
  amplitude.track('setting: click, reset',
  {
    view: 'setting',
    action: 'click',});
}
export function cancelResetWithBackDrop() {
  amplitude.track('setting: cancel, reset, with backdrop',
  {
    view: 'setting',
    action: 'cancel',});
}
export function cancelResetBtn() {
  amplitude.track('setting: cancel, reset, in reset modal',
  {
    view: 'setting',
    action: 'cancel',
    secondView: 'reset modal',});
}
export function confirmResetBtn() {
  amplitude.track('setting: confirm, reset, in reset modal',
  {
    view: 'setting',
    action: 'confirm',
    secondView: 'reset modal',});
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


/* statistics view */
export function moveToPastMonth() {
  amplitude.track('statistics: click, past month',
  {
    view: 'statistics',
    action: 'click',});
}
export function moveToNextMonth() {
  amplitude.track('statistics: click, next month',
  {
    view: 'statistics',
    action: 'click',});
}
export function moveToSummary() {
  amplitude.track('statistics: click, summary',
  {
    view: 'statistics',
    action: 'click',});
}
export function moveToDetail() {
  amplitude.track('statistics: click, detail',
  {
    view: 'statistics',
    action: 'click',});
}