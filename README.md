# 인-싸이월드 서버 확장판

여기는 인싸이월드 서버 개발자 중 한 명이 개인 연습용으로 이런저런 테스트를 추가한 repo입니다.  

서버 배포용 소스코드는 [오리지날 인싸월 repo](https://github.com/SOPT27-JOB/IN-CYWORLD-SERVER)를 참조해주세요.  

<img style="border: 1px solid black !important; border-radius:20px;" width="250px" src="https://user-images.githubusercontent.com/37949197/99885070-c1412580-2c75-11eb-8ec8-4214faab2acf.png"/>
<br>

- **SOPT 27th 솝커톤**
- 프로젝트 기간: 2020.11.21 ~ 22 + α
- 배포링크 : https://in-cyworld.vercel.app/
	
<br>

## 책갈피
### [확장판 - 테스트 도입](#-확장판---테스트-도입)
### [프로젝트 설명](#-프로젝트-설명)

<br>

## **📌 확장판 - 테스트 도입**
ver2로 넘어오면서 각 기능에 대한 테스트를 도입했습니다.

<br>

``` bash
$ npm test
```
를 입력하면, 테스트용 DB&포트가 설정된 후 테스팅 툴인 jest가 실행됩니다.

<br>

### **🔑단위 테스트**
단위 테스트에선,  
#### 각각의 컨트롤러가 서로 다른 입력에 따라 원하는대로 작동하는지
테스트했습니다.  

<br>

다음은 getResult 컨트롤러에서
* 올바른 testNum이 주어지면 200에 해당하는 응답을 리턴하고
* 그렇지 않은 testNum이 주어지면 400에 해당하는 응답을 리턴하며
* DB 접근 도중 에러가 났을 경우 500에 해당하는 응답을 리턴하는 코드입니다.
```js
describe("getResult", () => {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };

    
    test("testNum 1이 주어진다면 정상json 반환", async () => {
        const expectedResults = {
            id: expect.any(Number),
            imageUrl: expect.any(String),
            videoUrl: expect.any(String),
            title: expect.any(String),
            guide: expect.any(String),
        };
        Result.findOne.mockReturnValue(expectedResults);

        const req = {
            params: {
                levelNum: 1,
            },
        };

        await getResult(req, res);
        expect(res.status).toBeCalledWith(statusCode.OK);
        expect(res.send).toBeCalledWith(
            util.success(statusCode.OK, resMessage.SUCCESS, expectedResults),
        );
    });

    test("testNum 0이 주어진다면 에러json 반환", async () => {
        const req = {
            params: {
                levelNum: 0,
            },
        };

        await getResult(req, res);
        expect(res.status).toBeCalledWith(statusCode.INVALID_VALUE);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.INVALID_VALUE, resMessage.INVALID_VALUE),
        );
    });

    test("Result 조회 중 에러가 발생했을 경우 500 json 리턴", async () => {
        Result.findOne.mockReturnValue(Promise.reject());

        const req = {
            params: {
                levelNum: 1,
            },
        };

        await getResult(req, res);
        expect(res.status).toBeCalledWith(statusCode.INTERNAL_SERVER_ERROR);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR),
        );
    });
});
```

#### 테스트 결과는 다음과 같습니다.
![image](https://user-images.githubusercontent.com/29622782/120136068-8a436200-c20c-11eb-8508-3e04cca03651.png)
![image](https://user-images.githubusercontent.com/29622782/120136101-9d563200-c20c-11eb-8fda-60686be07e8c.png)

### **🔑통합 테스트**
단위 테스트로 각 컨트롤러가 다양한 경우의 입력에 따라 정상작동하는 것을 확인했습니다.  

<br>

통합 테스트에선,  
#### 각 컨트롤러로 이뤄진 API가 잘 동작하는지
테스트했습니다.  

<br>

다음은 getResult 컨트롤러에서
* 올바른 levelNum이 주어지면 200에 해당하는 응답을 리턴하고
* 그렇지 않은 levelNum이 주어지면 400에 해당하는 응답을 리턴하는 코드입니다.
* 실제 DB에 접근하기 때문에, beforeAll과 afterAll로 DB를 원하는 상태로 초기화시켜줬습니다.
```js
beforeAll(async () => {
    await sequelize.sync();
    for (let data of expectedDatas) {
        await Result.create(data);
    }
});

describe("GET /result/:levelNum", () => {
    test("levelNum 1~4가 주어질 경우 정상json 응답하기", async () => {
        await req(app)
            .get("/result/1")
            .expect(
                statusCode.OK,
                util.success(
                    statusCode.OK,
                    resMessage.SUCCESS,
                    expectedDatas[0],
                ),
            );
        // 중간 생략 ...
    });

    test("levelNum 1~4가 아닌 값이 주어질 경우 에러json 응답하기", async () => {
        await req(app)
            .get("/result/0")
            .expect(
                statusCode.INVALID_VALUE,
                util.fail(statusCode.INVALID_VALUE, resMessage.INVALID_VALUE),
            );
    });
});

afterAll(async () => {
    await sequelize.sync({ force: true });
});
```
<br>

테스트 결과는 다음과 같습니다.

<br>

![image](https://user-images.githubusercontent.com/29622782/120136318-0473e680-c20d-11eb-8907-d1d574cae586.png)
![image](https://user-images.githubusercontent.com/29622782/120136246-dd1d1980-c20c-11eb-9b77-c5ebf9080b30.png)
![image](https://user-images.githubusercontent.com/29622782/120136182-c676c280-c20c-11eb-9602-1b6e895701a2.png)
  

### **🔑coverage 측정**
``` bash
$ npm run coverage
```
를 입력하면, jest가 --coverage 옵션과 함께 실행됩니다.  

<br>

![image](https://user-images.githubusercontent.com/29622782/120157834-642eb980-c22e-11eb-82bb-ad2d4b1932c0.png)

<br>

(커버리지 100%를 향하여!!🔥)


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

```js
User.init(sequelize);
Result.init(sequelize);

Result.associate(db);
```

<br>

## **📙 DB ERD**
![ERD](https://user-images.githubusercontent.com/29622782/120152996-254a3500-c229-11eb-9e74-b982cb4744d9.png)



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
- user 처리 : 점수를 받아 결과 반환 및 DB 저장 구현
- 매일 유저트래픽 메일전송 구현 (솝커톤 이후)
- 테스트코드 작성 (확장판)


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

