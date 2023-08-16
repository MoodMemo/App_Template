import * as amplitude from '@amplitude/analytics-react-native';

// import * as amplutude from './AmplitudeAPI';

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
export function pushCloseToDetailModal() {
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