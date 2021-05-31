# 인-싸이월드 서버 확장판

여기는 인싸이월드 서버 개발자 중 한 명이 개인 연습용으로 이런저런 테스트를 추가한 repo입니다.  
서버 배포용 소스코드는 [오리지날 인싸월 repo](https://github.com/SOPT27-JOB/IN-CYWORLD-SERVER)를 참조해주세요.

<img style="border: 1px solid black !important; border-radius:20px;" width="250px" src="https://user-images.githubusercontent.com/37949197/99885070-c1412580-2c75-11eb-8ec8-4214faab2acf.png"/>
<br>

- **SOPT 27th 솝커톤**
- 프로젝트 기간: 2020.11.21 ~ 22 + α
- 배포링크 : https://in-cyworld.vercel.app/
	

<br>


  
## **💁 프로젝트 설명**
### 90년대 감성 테스트
코로나보다 무서운 Z세대 밈에 중독된 2020년...  
90년대생들은 순살 당했다는게 무슨 소리인지도   
모른 채 무시무시한 Z세대 드립에 조롱당하고 있다...
<br/><br/>
Z세대들, 그대들은 90년대생에 대해 얼마나 알고 있는가?!  
지금 당장 인-싸이월드 테스트로 그대의 세대 감수성을 시험하라


<br>

## **📑 API 명세서**

- **[API 명세서 ](https://github.com/SOPT27-JOB/JOB-SERVER/wiki/Cyworld-Server)**  


<br>
  
## ✔ **models/index.js**

```jsx
db.User = require("./user")(sequelize, Sequelize);
db.Result = require("./result")(sequelize, Sequelize);

db.User.belongsTo(db.Result);
db.Result.hasMany(db.User, { onDelete: "cascade" });
```

<br>

## **📙 DB ERD**


![Snipaste_2020-11-22_03-46-48](https://user-images.githubusercontent.com/37949197/99885098-e3d33e80-2c75-11eb-909c-8ae1a3db6caa.png)



<br>

## **🏃‍♂️ 기능 소개**

- 10개의 테스트 결과를 받아, 점수를 계산
- 내 점수대는 어떤 유형인지 알려줌
- 동년배 중, 상위 몇 %인지 알려줌


<br>

## **🌎 Team Role**

### **🙋‍♀️ 김민지**

- ERD 설계
- level별 result 조회
- 동년배 별, user 상위 % 알고리즘 구현
- 배포

### **🙋‍♂️ 강준우**

- ERD 설계
- 프로젝트 구조 setting
- user 정보 DB 저장
- user 점수 알고리즘 구현


<br>

## **📘 Package**

사용 패키지(모듈)은 다음과 같습니다.

```json
{
    "dependencies": {
        "@types/sequelize": "^4.28.9",
        "cookie-parser": "~1.4.4",
        "cors": "^2.8.5",
        "debug": "~2.6.9",
        "ejs": "^3.1.6",
        "express": "~4.16.1",
        "http-errors": "~1.6.3",
        "jade": "^1.9.2",
        "lodash": "^4.17.21",
        "moment": "^2.29.1",
        "morgan": "~1.9.1",
        "mysql2": "^2.2.5",
        "node-schedule": "^2.0.0",
        "nodemailer": "^6.4.18",
        "nodemon": "^2.0.6",
        "sequelize": "^6.3.5",
        "sequelize-cli": "^6.2.0"
    },
    "devDependencies": {
        "@types/jest": "^26.0.23",
        "jest": "^27.0.2",
        "supertest": "^6.1.3"
    }
}
```

## **📌 테스트 도입**
ver2로 넘어오면서 각 기능에 대한 테스트를 도입했습니다.
![image](https://user-images.githubusercontent.com/29622782/120135912-3769aa80-c20c-11eb-9165-793e8d06fb87.png)


### **🧪 unit test - user**
![image](https://user-images.githubusercontent.com/29622782/120136068-8a436200-c20c-11eb-8508-3e04cca03651.png)

### **🧪 unit test - result**
![image](https://user-images.githubusercontent.com/29622782/120136101-9d563200-c20c-11eb-8fda-60686be07e8c.png)

### **🧪 integration test - user**
![image](https://user-images.githubusercontent.com/29622782/120136318-0473e680-c20d-11eb-8907-d1d574cae586.png)

### **🧪 integration test - result**
![image](https://user-images.githubusercontent.com/29622782/120136246-dd1d1980-c20c-11eb-9b77-c5ebf9080b30.png)

### **🧪 integration test - 예외상황**
![image](https://user-images.githubusercontent.com/29622782/120136182-c676c280-c20c-11eb-9602-1b6e895701a2.png)