ifneq (,$(wildcard ./.env))
	include .env
	export
endif

# Настройки сборки
# apk settings (building)
apk:=app-release-unsigned.apk
aligned-apk:=app-release-unsigned-aligned.apk
signed-apk:=app-release-signed.apk
signed-aligned-apk:=app-release-signed-aligned.apk
public-apk:=board-game-1.apk

# paths
release-path:=android/app/build/outputs/apk/release
drive-apk-path:=/android/board-game-1

# keystore settings (signing)
# хранить их тут потенциально небезопасно, но это позволяет подписывать приложение в одну команду
keystore:=board-game-1.keystore
keystore-alias:=zn
keystore-pass:="${KEYSTORE_PASSWORD}"
entity:="CN=Anton Abradzin, OU=ZN Dev, O=ZN, L=Unknown, S=Belarus, C=BY"

# Команды

# Основная команда, собирает приложение и подписывает его
.phony: release
release: build sign zip-align upload

# make generate-key создает ключ для подписи приложения
generate-key:
	echo "Removing old key"
	rm $(keystore) -f

	keytool	-genkey -v \
					-keystore $(keystore) \
					-alias $(keystore-alias) \
					-keyalg RSA \
					-keysize 2048 \
					-storetype PKCS12 \
					-storepass $(keystore-pass) \
					-validity 9200 \
					-dname $(entity)

build-android:
	yarn build
	yarn cap copy
	cd android && ./gradlew assembleRelease

# Сборка приложения
.phony: build
build: build-android

# Копирование ключа в папку с собранным приложением
copy-keystore:
	cp $(keystore) $(release-path)/$(keystore)

# Подпись приложения ключом
sign: copy-keystore
	cp $(release-path)/$(apk) $(release-path)/$(signed-apk)
	jarsigner -sigalg SHA1withRSA \
						-digestalg SHA1 \
						-keystore $(keystore) $(release-path)/$(signed-apk) $(keystore-alias) \
						-storepass $(keystore-pass)

zip-align:
	zipalign -f 4 $(release-path)/$(apk) $(release-path)/$(aligned-apk)
	zipalign -f 4 $(release-path)/$(signed-apk) $(release-path)/$(signed-aligned-apk)

upload:
	cp $(release-path)/$(signed-aligned-apk) /tmp/$(public-apk)
	rclone copy -P /tmp/$(public-apk) gdrive:$(drive-apk-path)/
	rclone link gdrive:$(drive-apk-path)/$(public-apk)
