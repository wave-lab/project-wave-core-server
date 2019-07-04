# project_wave_server

* 2019 SOPT 24기 커버곡 플랫폼 'wave'
* 프로젝트 기간 : 2019년 6월 29일 ~ 2019년 7월 12일]
* **API** - (https://github.com/wave-lab/project-wave-server/wiki)

## 의존성

```
"dependencies": {
    "aws-sdk": "^2.463.0",
    "cookie-parser": "~1.4.4",
    "cors": "^2.8.5",
    "crypto-promise": "^2.1.0",
    "debug": "~2.6.9",
    "ejs": "^2.6.2",
    "express": "~4.16.1",
    "helmet": "^3.18.0",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.24.0",
    "moment-timezone": "^0.5.25",
    "mongoose": "^5.6.2",
    "morgan": "~1.9.1",
    "multer": "^1.4.1",
    "multer-s3": "^2.9.0",
    "promise-mysql": "^3.3.2",
    "query-string": "^6.5.0",
    "querystring": "^0.2.0",
    "rand-token": "^0.4.0"
  }
```

## 시작하기

모든 소스코드는 vscode+ Windows10/MAC + Node.js 10 환경에서 작성되었습니다.

- Node.js의 Async/Await 도구를 사용해 (Promise) 비동기 제어를 하고 있습니다.
- Node.js의 버전을 7.6 이상으로 유지해햐 합니다.

### 설치하기

- `nodejs` 와 `npm` 을 설치합니다. 설치 방법은 [nodejs.org](https://nodejs.org) 를 참고하세요.
- Node.js 8 LTS 버전을 설치합니다.
- 실행에 필요한 의존성을 설치합니다.

```
  npm install
```

### 실행하기

```
  npm start
```

- `localhost:3000`으로 접속이 가능합니다

### AWS EC2 실행 하기

- `nodejs` 와 `npm` 을 설치합니다. 설치 방법은 [nodejs.org](https://nodejs.org) 를 참고하세요.
- Node.js 8 LTS 버전을 설치합니다.

- 실행에 필요한 의존성을 설치합니다.

```
  npm install
```

### 실행하기

- Express 앱용 프로세스 관리자 `pm2 `를 이용해 배포 합니다.

```
  npm install pm2 -g
```

- Express 앱용 프로세스 관리자 `pm2 `를 이용해 배포 합니다.

```
  pm2 start ./bin/www --name "앱 이름"
```

- 현재 실행중인 프로세스 목록을 확인 합니다.

```
  pm2 list
```

- 프로세스를 중지 합니다.

```
  pm2 delete --name "앱 이릅"
```

- 프로세스를 모니터 합니다.

```
  pm2 moni t --name "앱 이름"
```

- `ec2_ip:3000`으로 접속이 가능합니다

## 배포

- AWS EC2 - 애플리케이션 서버
- AWS RDS - db 서버
- AWS S3 - 저장소 서버

## 사용된 도구

- [Node.js](https://nodejs.org/ko/) - Chrome V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임
- [Express.js](http://expressjs.com/ko/) - Node.js 웹 애플리케이션 프레임워크
- [NPM](https://rometools.github.io/rome/) - 자바 스크립트 패키지 관리자
- [PM2](http://pm2.keymetrics.io/) - Express 앱용 프로세스 관리자
- [vscode](https://code.visualstudio.com/) - 편집기
- [Mysql](https://www.mysql.com/) - DataBase
- [MongoDB](https://www.mongodb.com/) - DataBase
- [NGINX](https://nginx.org/en/) - web server
- [AWS EC2](https://aws.amazon.com/ko/ec2/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_ec2_b&sc_content=ec2_e&sc_detail=aws%20ec2&sc_category=ec2&sc_segment=177228231544&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177228231544!e!!g!!aws%20ec2&ef_id=WkRozwAAAnO-lPWy:20180412120123:s) - 클라우드 환경 컴퓨팅 시스템
- [AWS RDS](https://aws.amazon.com/ko/rds/) - 클라우드 환경 데이터베이스 관리 시스템
- [AWS S3](https://aws.amazon.com/ko/s3/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_s3_b&sc_content=s3_e&sc_detail=aws%20s3&sc_category=s3&sc_segment=177211245240&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177211245240!e!!g!!aws%20s3&ef_id=WkRozwAAAnO-lPWy:20180412120059:s) - 클라우드 환경 데이터 저장소

## 개발자

- **김예진** - [jineeee](https://github.com/jineeee) 
- **심정욱** - [SimJungUk](https://github.com/SimJungUk) 
- **석영현** - [yeonghyeonSeok](https://github.com/yeonghyeonSeok) 

[기여자 목록](https://github.com/wave-lab/project-wave-server/graphs/contributors)을 확인하여 이 프로젝트에 참가하신 분들을 보실 수 있습니다.

## wave의 다른 프로젝트

- [ANDROID](https://github.com/wave-lab/project-wave-Android) 
- [IOS](https://github.com/wave-lab/project-wave-iOS) 

