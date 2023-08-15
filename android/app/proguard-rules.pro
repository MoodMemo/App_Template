# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:


# Keep Realm classes and their fields
-keep class io.realm.** {*;}
# Keep RealmModel, RealmObject, and RealmList
-keep public class * extends io.realm.RealmModel
-keep public class * extends io.realm.RealmObject
-keep public class * extends io.realm.RealmList
# Keep names of classes used by Realm
-keepnames class io.realm.internal.** { *; }

# Keep Realm classes and their fields
-keep class io.realm.** {*;}
# Keep RealmModel, RealmObject, and RealmList
-keep public class * extends io.realm.RealmModel
-keep public class * extends io.realm.RealmObject
-keep public class * extends io.realm.RealmList
# Keep names of classes used by Realm
-keepnames class io.realm.internal.** { *; }
# 아래는 임시
# Realm과 관련된 클래스를 축소하는 옵티마이저 사용을 중지합니다
-dontoptimize
# 만약 Realm 데이터베이스 파일도 보호하고 싶다면 다음과 같은 설정도 추가할 수 있습니다
-keep class io.realm.** { *; }
-keep @io.realm.annotations.RealmModule class * { *; }
-dontwarn javax.**
-dontwarn io.realm.**