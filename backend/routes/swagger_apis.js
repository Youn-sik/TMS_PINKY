 /**
 * @swagger
 *  paths:
 *    /login:
 *       post:
 *         tags:
 *         - "account"
 *         summary: "로그인"
 *         description: ""
 *         operationId: "login"
 *         produces:
 *         - "application/json"
 *         parameters:
 *         - name: "body"
 *           in: "body"
 *           description: "아이디,비밀번호"
 *           required: true
 *           type: object
 *           properties:
 *              user_id:
 *                  type: string
 *                  example: 'admin'
 *              user_pw:
 *                  type: string
 *                  example: '12345'
 *         responses:
 *             "200":
 *               description: "인증 성공"
 *               schema:
 *                  type: object
 *                  properties:
 *                      auth:
 *                          type: string
 *                          example: "JWT"
 *                          description: 토큰
 *    /auth:
 *       get:
 *         tags:
 *         - "account"
 *         summary: "유효 토큰 인증"
 *         description: "사용자의 토큰이 인증된 토큰인지 검사합니다"
 *         operationId: "auth"
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "auth"
 *            in: "query"
 *            description: "JWT 값"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: 'string'
 *         responses:
 *             "200":
 *               description: "인증 성공"
 *               schema:
 *                  type: object
 *                  properties:
 *                      auth:
 *                          type: boolean
 *                          description: 인증 성공 여부
 *                          example: true
 *                      user_id:
 *                          type: string
 *                          description: 해당 계정의 mongodb obid
 *                          example: '5f5f1b5e146373e6fee1afcc'
 *                      authority:
 *                          type: string
 *                          example: 'admin'
 *                          description: 계정의 권한
 *                      tempLimit:
 *                          type: number
 *                          description: 계정에서 설정된 온도경고 기준 온도
 *                          example: 37.5             
 *    /account:
 *       post:
 *          tags:
 *          - "account"
 *          summary: "계정등록"
 *          description: "웹에 로그인 하기 위한 계정을 생성합니다."
 *          operationId: "postAccount"
 *          produces:
 *          - "application/json"
 *          parameters:
 *          - name: "body"
 *            in: "body"
 *            description: "토큰"
 *            default: json
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                 user_id:
 *                      type: string
 *                      description: "아이디"
 *                      example: 'string'
 *                 user_pw:
 *                      type: string
 *                      description: "패스워드"
 *                      example: 'string'
 *                 user_name:
 *                      type: string
 *                      description: "이름"
 *                      example: 'string'
 *                 user_lang:
 *                      type: string
 *                      description: "언어"
 *                      example: 'string' 
 *                 authority:
 *                      type: string
 *                      description: 계정의 권한
 *                      example: 'admin ,manager-abcd, manager-abcd-user-user1234, admin-user-user1234' 
 *       get:
 *         tags:
 *         - "account"
 *         summary: "계정 목록"
 *         operationId: "getAccountList"
 *         description: "모든 계정 목록을 불러옵니다 비밀번호는 포함되지 않습니다."
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "authority"
 *            in: "query"
 *            description: "로그인 계정의 권한"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: 'admin'
 *         responses:
 *             "200":
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          auth:
 *                              type: boolean
 *                              description: 인증 성공 여부
 *                              example: true
 *                          user_id:
 *                              type: string
 *                              description: 해당 계정의 mongodb obid
 *                              example: '5f5f1b5e146373e6fee1afcc'
 *                          authority:
 *                              type: string
 *                              example: 'admin'
 *                              description: 계정의 권한
 *                          tempLimit:
 *                              type: number
 *                              description: 계정에서 설정된 온도경고 기준 온도
 *                              example: 37.5     
 *    /account/{obid}:
 *       put:
 *         tags:
 *         - "account"
 *         summary: "계정 업데이트"
 *         operationId: "updateAccount"
 *         description: "계정을 업데이트 합니다"
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "account obid"
 *            in: "path"
 *            description: "계정의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5efae2fa1718abd4478795b9'
 *            value: '5efae2fa1718abd4478795b9'
 *          - in: "body"
 *            name: "body"
 *            default: json
 *            required: true
 *            type: object
 *            schema:
 *              type: object
 *              properties:
 *                 user_id:
 *                      type: string
 *                      description: "아이디"
 *                      example: 'string'
 *                 user_pw:
 *                      type: string
 *                      description: "패스워드"
 *                      example: 'string'
 *                 user_name:
 *                      type: string
 *                      description: "이름"
 *                      example: 'string'
 *                 user_lang:
 *                      type: string
 *                      description: "언어"
 *                      example: 'string' 
 *                 authority:
 *                      type: string
 *                      description: 계정의 권한
 *                      example: 'admin ,manager-abcd, manager-abcd-user-user1234, admin-user-user1234' 
 *                 tempLimit:
 *                      type: number
 *                      description: 계정에서 설정된 온도경고 기준 온도
 *                      example: 37.5
 *                 tempType:
 *                      type: number
 *                      description: 출입관리 온도 표현방식 결정  1:숫자 ex)37.5   2:문자  ex)비정상 온도
 *                      example: 1 
 *         responses:
 *             "200":
 *               schema:
 *                  type: object
 *                  properties:
 *                          user_id:
 *                              type: boolean
 *                              description: 인증 성공 여부
 *                              example: true
 *                          user_name:
 *                              type: string
 *                              description: 해당 계정의 mongodb obid
 *                              example: '5f5f1b5e146373e6fee1afcc'
 *                          user_lang:
 *                              type: string
 *                              description: 해당 계정의 언어
 *                              example: 'ENG, KOR'
 *                          authority:
 *                              type: string
 *                              example: 'admin'
 *                              description: 계정의 권한
 *                          tempLimit:
 *                              type: number
 *                              description: 계정에서 설정된 온도경고 기준 온도
 *                              example: 37.5
 *                          tempType:
 *                              type: number
 *                              description: 출입관리 온도 표현방식 결정  1:숫자 ex)37.5   2:문자  ex)비정상 온도
 *                              example: 1 
 *       delete:
 *         tags:
 *         - "account"
 *         summary: "계정 삭제"
 *         operationId: "deleteAccount"
 *         description: "계정을 삭제합니다."
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "account obid"
 *            in: "path"
 *            description: "계정의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5efae2fa1718abd4478795b9'
 *            value: '5efae2fa1718abd4478795b9'
 *         responses:
 *             "200":
 *               schema:
 *                  type: object
 *                  properties:
 *                          user_id:
 *                              type: boolean
 *                              description: 인증 성공 여부
 *                              example: true
 *                          user_name:
 *                              type: string
 *                              description: 해당 계정의 mongodb obid
 *                              example: '5f5f1b5e146373e6fee1afcc'
 *                          user_lang:
 *                              type: string
 *                              description: 해당 계정의 언어
 *                              example: 'ENG, KOR'
 *                          authority:
 *                              type: string
 *                              example: 'admin'
 *                              description: 계정의 권한
 *                          tempLimit:
 *                              type: number
 *                              description: 계정에서 설정된 온도경고 기준 온도
 *                              example: 37.5
 *                          tempType:
 *                              type: number
 *                              description: 출입관리 온도 표현방식 결정  1:숫자 ex)37.5   2:문자  ex)비정상 온도
 *                              example: 1 
 * 
 *    /access:
 *       post:
 *          tags:
 *          - "access"
 *          summary: "출입 기록 등록"
 *          operationId: "postAccess"
 *          produces:
 *          - "application/json"
 *          parameters:
 *          - name: "body"
 *            in: "body"
 *            description: "토큰"
 *            default: json
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  create_at:
 *                      type: string
 *                      description: 생성날짜
 *                      example: 'string'
 *                  create_ut: 
 *                      type: string
 *                      description: utc 시간
 *                      example: 'string'
 *                  _id: 
 *                      type: string
 *                      description: mongodb obid
 *                      example: 'string'
 *                  avatar_type: 
 *                      type: number
 *                      description: 출입자 타입
 *                      example: 1
 *                  avatar_distance: 
 *                      type: string
 *                      description: 사진 찍힌 거리
 *                      example: 'string'
 *                  avatar_file_url: 
 *                      type: string
 *                      description: 사진 URL
 *                      example: 'string'
 *                  avatar_temperature: 
 *                      type: string
 *                      description: 출입자 온도
 *                      example: 'string'
 *                  access_time: 
 *                      type: string
 *                      description: 출입 시간
 *                      example: 'string'
 *                  stb_sn: 
 *                      type: string
 *                      description: 사진 찍은 단말의 시리얼 번호
 *                      example: 'string'
 *                  stb_obid: 
 *                      type: string
 *                      description: 사진 찍은 단말의 obid
 *                      example: 'string'
 *                  stb_name: 
 *                      type: string
 *                      description: 사진 찍은 단말의 이름
 *                      example: 'string'
 *                  stb_location: 
 *                      type: string
 *                      description: 사진 찍은 단말의 위치
 *                      example: 'string'
 *                  authority: 
 *                      type: string
 *                      description: 사진 찍은 단말을 등록한 계정의 권한
 *                      example: 'string'
 *                  name: 
 *                      type: string
 *                      description: 사진 찍힌 사람의 이름
 *                      example: 'string'
 *          responses:
 *             "200":
 *               schema:
 *                  type: object
 *                  properties:
 *                   create_at:
 *                       type: string
 *                       description: 생성날짜
 *                       example: 'string'
 *                   create_ut: 
 *                       type: string
 *                       description: utc 시간
 *                       example: 'string'
 *                   _id: 
 *                       type: string
 *                       description: mongodb obid
 *                       example: 'string'
 *                   avatar_type: 
 *                       type: number
 *                       description: 출입자 타입
 *                       example: 1
 *                   avatar_distance: 
 *                       type: string
 *                       description: 사진 찍힌 거리
 *                       example: 'string'
 *                   avatar_file_url: 
 *                       type: string
 *                       description: 사진 URL
 *                       example: 'string'
 *                   avatar_temperature: 
 *                       type: string
 *                       description: 출입자 온도
 *                       example: 'string'
 *                   access_time: 
 *                       type: string
 *                       description: 출입 시간
 *                       example: 'string'
 *                   stb_sn: 
 *                       type: string
 *                       description: 사진 찍은 단말의 시리얼 번호
 *                       example: 'string'
 *                   stb_obid: 
 *                       type: string
 *                       description: 사진 찍은 단말의 obid
 *                       example: 'string'
 *                   stb_name: 
 *                       type: string
 *                       description: 사진 찍은 단말의 이름
 *                       example: 'string'
 *                   stb_location: 
 *                       type: string
 *                       description: 사진 찍은 단말의 위치
 *                       example: 'string'
 *                   authority: 
 *                       type: string
 *                       description: 사진 찍은 단말을 등록한 계정의 권한
 *                       example: 'string'
 *                   name: 
 *                       type: string
 *                       description: 사진 찍힌 사람의 이름
 *                       example: 'string'
 *       get:
 *         tags:
 *         - "access"
 *         summary: "출입자 목록"
 *         operationId: "access"
 *         parameters:
 *         - name: "auth"
 *           in: "query"
 *           description: "로그인한 계정의 권한"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: 'admin'
 *         - name: "date"
 *           in: "query"
 *           description: "검색 날짜 범위"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: '2020-11-02/2020-11-02'
 *         - name: "avatar_type"
 *           in: "query"
 *           description: '출입자의 타입 0:전체, 1:사원, 3:미등록자, 4:블랙리스트'
 *           type: "string"
 *           format: "string"
 *           example: '[0,1,3,4]'
 *         - name: "searchType"
 *           in: "query"
 *           description: '검색할 타입 선택'
 *           type: "string"
 *           format: "string"
 *           example: '[name,stb_sn,stb_name,stb_location]'
 *         - name: "search"
 *           in: "query"
 *           description: '검색할 문자열  공백:전체'
 *           type: "string"
 *           format: "string"
 *           example: '사원1'
 *         - name: "tempType"
 *           in: "query"
 *           description: '온도 기준 0:전체 1:정상 온도 2:비정상 온도'
 *           type: "string"
 *           format: "string"
 *           example: '[0,1,2]'
 *         - name: "avatar_temperature"
 *           in: "query"
 *           description: '정상 온도, 비정상 온도 판단의 기준 온도'
 *           type: "string"
 *           format: "string"
 *           example: '37.5'
 *         - name: "rowsPerPage"
 *           in: "query"
 *           description: '페이지당 표시 갯수'
 *           type: "string"
 *           format: "string"
 *           example: '7'
 *         - name: "page"
 *           in: "query"
 *           description: '페이지'
 *           type: "string"
 *           format: "string"
 *           example: '1'
 *         responses:
 *             "200":
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object 
 *                      properties:
 *                          create_at:
 *                              type: string
 *                              description: 생성날짜
 *                              example: 'string'
 *                          create_ut:
 *                              type: string
 *                              description: utc 시간
 *                              example: 'string'
 *                          _id: 
 *                              type: string
 *                              description: mongodb obid
 *                              example: 'string'
 *                          avatar_type: 
 *                              type: number
 *                              description: 출입자 타입
 *                              example: 1
 *                          avatar_distance: 
 *                              type: string
 *                              description: 사진 찍힌 거리
 *                              example: 'string'
 *                          avatar_file_url: 
 *                              type: string
 *                              description: 사진 URL
 *                              example: 'string'
 *                          avatar_temperature: 
 *                              type: string
 *                              description: 출입자 온도
 *                              example: 'string'
 *                          access_time: 
 *                              type: string
 *                              description: 출입 시간
 *                              example: 'string'
 *                          stb_sn: 
 *                              type: string
 *                              description: 사진 찍은 단말의 시리얼 번호
 *                              example: 'string'
 *                          stb_obid: 
 *                              type: string
 *                              description: 사진 찍은 단말의 obid
 *                              example: 'string'
 *                          stb_name: 
 *                              type: string
 *                              description: 사진 찍은 단말의 이름
 *                              example: 'string'
 *                          stb_location: 
 *                              type: string
 *                              description: 사진 찍은 단말의 위치
 *                              example: 'string'
 *                          authority: 
 *                              type: string
 *                              description: 사진 찍은 단말을 등록한 계정의 권한
 *                              example: 'string'
 *                          name: 
 *                              type: string
 *                              description: 사진 찍힌 사람의 이름
 *                              example: 'string'
 *                          
 *       delete:
 *         tags:
 *         - "access"
 *         summary: "출입 기록 삭제"
 *         operationId: "deleteAccount"
 *         description: "검색 조건에 해당하는 출입기록,사진을 삭제 합니다."
 *         produces:
 *         - "application/json"
 *         parameters:
 *         - name: "auth"
 *           in: "query"
 *           description: "로그인한 계정의 권한"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: 'admin'
 *         - name: "date"
 *           in: "query"
 *           description: "검색 날짜 범위"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: '2020-11-02/2020-11-02'
 *         - name: "avatar_type"
 *           in: "query"
 *           required: true
 *           description: '출입자의 타입 0:전체, 1:사원, 3:미등록자, 4:블랙리스트'
 *           type: "string"
 *           format: "string"
 *           example: '[0,1,3,4]'
 *         - name: "searchType"
 *           in: "query"
 *           required: true
 *           description: '검색할 타입 선택'
 *           type: "string"
 *           format: "string"
 *           example: '[name,stb_sn,stb_name,stb_location]'
 *         - name: "search"
 *           in: "query"
 *           required: true
 *           description: '검색할 문자열  공백:전체'
 *           type: "string"
 *           format: "string"
 *           example: '사원1'
 *         - name: "tempType"
 *           in: "query"
 *           required: true
 *           description: '온도 기준 0:전체 1:정상 온도 2:비정상 온도'
 *           type: "string"
 *           format: "string"
 *           example: '[0,1,2]'
 *         - name: "avatar_temperature"
 *           in: "query"
 *           required: true
 *           description: '정상 온도, 비정상 온도 판단의 기준 온도'
 *           type: "string"
 *           format: "string"
 *           example: '37.5'
 *         responses:
 *            "200":
 *            schema:
 *              type: object
 *              properties:
 *                   n:
 *                       type:number
 *                       description:일치갯수
 *                       example:470
 *                   ok:
 *                       type:number
 *                       description:삭제 여부
 *                       example:1
 *                   deletedCount:
 *                       type:number
 *                       description:삭제된 갯수
 *                       example:470
 *    /access?type=dateCount:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "?type=dateCount 페이징을 위한 출입자 카운트"
 *         operationId: "dateCount"
 *         parameters:
 *         - name: "auth"
 *           in: "query"
 *           description: "로그인한 계정의 권한"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: 'admin'
 *         - name: "date"
 *           in: "query"
 *           description: "검색 날짜 범위"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: '2020-11-02/2020-11-02'
 *         - name: "avatar_type"
 *           in: "query"
 *           description: '출입자의 타입 0:전체, 1:사원, 3:미등록자, 4:블랙리스트'
 *           type: "string"
 *           format: "string"
 *           example: '[0,1,3,4]'
 *         - name: "searchType"
 *           in: "query"
 *           description: '검색할 타입 선택'
 *           type: "string"
 *           format: "string"
 *           example: '[name,stb_sn,stb_name,stb_location]'
 *         - name: "search"
 *           in: "query"
 *           description: '검색할 문자열  공백:전체'
 *           type: "string"
 *           format: "string"
 *           example: '사원1'
 *         - name: "tempType"
 *           in: "query"
 *           description: '온도 기준 0:전체 1:정상 온도 2:비정상 온도'
 *           type: "string"
 *           format: "string"
 *           example: '[0,1,2]'
 *         - name: "avatar_temperature"
 *           in: "query"
 *           description: '정상 온도, 비정상 온도 판단의 기준 온도'
 *           type: "string"
 *           format: "string"
 *           example: '37.5'
 *         - name: "rowsPerPage"
 *           in: "query"
 *           description: '페이지당 표시 갯수'
 *           type: "string"
 *           format: "string"
 *           example: '7'         
 *         responses:
 *             "200":
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object 
 *                      properties:
 *                          count:
 *                              type: number
 *                              description: 검색 조건에 일치하는 촐입자 총합
 *                              example: 47253
 *    /access?type=todayStatistics:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "?type=todayStatistics 금일 출입 카운트"
 *         operationId: "todayStatistics"
 *         parameters:
 *         - name: "auth"
 *           in: "query"
 *           description: "로그인한 계정의 권한"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: 'admin'
 *         responses:
 *             "200":
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object 
 *                      properties:
 *                          _id:
 *                              type: object
 *                              properties:
 *                                  type:
 *                                     type: object
 *                                     description: 출입자 타입
 *                                     example: 1
 *                          count:
 *                              type: number
 *                              description: 해당 타입의 오늘 출입자 총함
 *                              example: 13889
 *                  example:
 *                      - {_id: {type: 1}, count: 51}
 *                      - {_id: {type: 3}, count: 0}
 *                      - {_id: {type: 4}, count: 64}
 *    /access?type=deviceGroupAccesses:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "?type=deviceGroupAccesses 시간별 카운트"
 *         operationId: "deviceGroupAccesses"
 *         parameters:
 *         - name: "auth"
 *           in: "query"
 *           description: "로그인한 계정의 권한"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: 'admin'
 *         - name: "date"
 *           in: "query"
 *           description: "원하는 날짜 범위 설정"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: '2020-11-02/2020-11-02'
 *         - name: "device"
 *           in: "query"
 *           description: "통계를 보길 원하는 단말 선택  all:전체 단말"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: 'all'
 *         responses:
 *             "200":
 *               schema:
 *                  type: object
 *                  properties:
 *                      accesss:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  0:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  1:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  2:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  3:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  4:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  5:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  6:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  7:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  8:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  9:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  10:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  11:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  12:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  13:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  14:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  15:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  16:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  17:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  18:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  19:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  20:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  21:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  22:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  23:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  all_count:
 *                                      type: number
 *                                      description: 해당날짜, 단말에 찍힌 출입자 총합
 *                                      example: 123
 *                                  employee:
 *                                      type: number
 *                                      description: 해당날짜, 단말에 찍힌 사원 출입자 총합
 *                                      example: 123
 *                                  black:
 *                                      type: number
 *                                      description: 해당날짜, 단말에 찍힌 블랙리스트 출입자 총합
 *                                      example: 123
 *                                  camera_obid:
 *                                      type: string
 *                                      description: 해당 통계가 생성된 단말 obid
 *                                      example: "5f8e81f4c3c4095ae08614bf"
 *                                  authority:
 *                                      type: string
 *                                      description: 단말을 생성한 계정의 권한
 *                                      example: "admin"
 *                                  serial_number:
 *                                      type: string
 *                                      description: 해당 통계가 생성된 단말 시리얼 번호
 *                                      example: "KSTC200708"
 *                                  access_date:
 *                                      type: string
 *                                      description: 해당 통계가 생성된 날짜
 *                                      example: "2020-10-29"
 *                                  _id:
 *                                      type: string
 *                                      description: 해당 통계의 obid
 *                                      example: "5f8e81f4c3c4095ae08614bf"
 *    /access?type=weekStatistics:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "?type=weekStatistics 주간 출입 카운트"
 *         operationId: "weekStatistics"
 *         parameters:
 *         - name: "auth"
 *           in: "query"
 *           description: "로그인한 계정의 권한"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: 'admin'
 *         responses:
 *             "200":
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object 
 *                      properties:
 *                          _id:
 *                              type: object
 *                              properties:
 *                                  type:
 *                                     type: object
 *                                     description: 출입자 타입
 *                                     example: 1
 *                          count:
 *                              type: number
 *                              description: 해당 타입의 금주간의 출입자 총함
 *                              example: 13889
 *                  example:
 *                      - {_id: {type: 1}, count: 51}
 *                      - {_id: {type: 3}, count: 0}
 *                      - {_id: {type: 4}, count: 64}
 *    /access?type=deviceStats:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "?type=deviceStats 단말 통계"
 *         operationId: "deviceStats"
 *         parameters:
 *         - name: "auth"
 *           in: "query"
 *           description: "로그인한 계정의 권한"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: 'admin'
 *         - name: "device"
 *           in: "query"
 *           description: "통계를 보고 싶은 단말 시리얼 넘버  공백:전체 단말"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: 'KSTC200708'
 *         - name: "date"
 *           in: "query"
 *           description: "날짜 범위"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: '2020-10-27/2020-11-02'
 *         responses:
 *             "200":
 *               schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  0:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  1:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  2:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  3:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  4:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  5:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  6:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  7:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  8:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  9:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  10:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  11:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  12:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  13:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  14:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  15:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  16:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  17:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  18:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  19:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  20:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  21:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  22:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  23:
 *                                      type: number
 *                                      description: 해당 시간의 출입자 총합
 *                                      example: 11
 *                                  all_count:
 *                                      type: number
 *                                      description: 해당날짜, 단말에 찍힌 출입자 총합
 *                                      example: 123
 *                                  employee:
 *                                      type: number
 *                                      description: 해당날짜, 단말에 찍힌 사원 출입자 총합
 *                                      example: 123
 *                                  black:
 *                                      type: number
 *                                      description: 해당날짜, 단말에 찍힌 블랙리스트 출입자 총합
 *                                      example: 123
 *                                  camera_obid:
 *                                      type: string
 *                                      description: 해당 통계가 생성된 단말 obid
 *                                      example: "5f8e81f4c3c4095ae08614bf"
 *                                  authority:
 *                                      type: string
 *                                      description: 단말을 생성한 계정의 권한
 *                                      example: "admin"
 *                                  serial_number:
 *                                      type: string
 *                                      description: 해당 통계가 생성된 단말 시리얼 번호
 *                                      example: "KSTC200708"
 *                                  access_date:
 *                                      type: string
 *                                      description: 해당 통계가 생성된 날짜
 *                                      example: "2020-10-29"
 *                                  _id:
 *                                      type: string
 *                                      description: 해당 통계의 obid
 *                                      example: "5f8e81f4c3c4095ae08614bf"
 *    /access?type=temperature:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "?type=temperature 마지막 5명 출입 목록"
 *         operationId: "temperature"
 *         parameters:
 *         - name: "auth"
 *           in: "query"
 *           description: "로그인한 계정의 권한"
 *           required: true
 *           type: "string"
 *           format: "string"
 *           example: 'admin'
 *         responses:
 *             "200":
 *               schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  create_at:
 *                                      type: string
 *                                      description: 만들어진 시간
 *                                      example: "2020-10-25 11:22:33"
 *                                  create_ut:
 *                                      type: string
 *                                      description: 만들어진 utc 시간
 *                                      example: "1604386267911"
 *                                  _id:
 *                                      type: string
 *                                      description: 출입자 obid
 *                                      example: "5fa0fddb349efc5887f04985"
 *                                  avatar_type:
 *                                      type: number
 *                                      description: 출입자 타입
 *                                      example: 1
 *                                  avatar_distance:
 *                                      type: number
 *                                      description: 사진 찍힌 거리
 *                                      example: 1.0
 *                                  avatar_file_url:
 *                                      type: string
 *                                      description: 사진 URL
 *                                      example: "http://172.16.135.112:3000/uploads/accesss/temp/20201103/KSTC2080019/KSTC2080019_%EC%82%AC%EC%9B%9018_1_36.366814_20201103155750.png"
 *                                  avatar_temperature:
 *                                      type: "string"
 *                                      description: 츨입자 온도
 *                                      example: "37.5"
 *                                  access_time:
 *                                      type: string
 *                                      description: 출입 시간
 *                                      example: "2020-10-25 11:22:33"
 *                                  stb_sn:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 시리얼 번호
 *                                      example: "KSTC200708"
 *                                  stb_obid:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 obid
 *                                      example: "5fa0fddb349efc5887f04985"
 *                                  stb_name:
 *                                      type: number
 *                                      description: 사진을 찍은 단말의 이름
 *                                      example: "string"
 *                                  stb_location:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 위치
 *                                      example: "string"
 *                                  authority:
 *                                      type: string
 *                                      description: 해당 단말을 등록한 계정의 권한
 *                                      example: "admin"
 *                                  name:
 *                                      type: string
 *                                      description: 출입자 이름
 *                                      example: "unknown"
 *    /access/{obid}:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "출입 기록 조회"
 *         description: "출입 기록을 불러옵니다"
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "access obid"
 *            in: "path"
 *            description: "출입 기록의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5eeab265563b45051fda7c4e'
 *            value: '5eeab265563b45051fda7c4e'
 *         responses:
 *             "200":
 *               schema:
 *                              type: object
 *                              properties:
 *                                  create_at:
 *                                      type: string
 *                                      description: 만들어진 시간
 *                                      example: "2020-10-25 11:22:33"
 *                                  create_ut:
 *                                      type: string
 *                                      description: 만들어진 utc 시간
 *                                      example: "1604386267911"
 *                                  _id:
 *                                      type: string
 *                                      description: 출입자 obid
 *                                      example: "5fa0fddb349efc5887f04985"
 *                                  avatar_type:
 *                                      type: number
 *                                      description: 출입자 타입
 *                                      example: 1
 *                                  avatar_distance:
 *                                      type: number
 *                                      description: 사진 찍힌 거리
 *                                      example: 1.0
 *                                  avatar_file_url:
 *                                      type: string
 *                                      description: 사진 URL
 *                                      example: "http://172.16.135.112:3000/uploads/accesss/temp/20201103/KSTC2080019/KSTC2080019_%EC%82%AC%EC%9B%9018_1_36.366814_20201103155750.png"
 *                                  avatar_temperature:
 *                                      type: "string"
 *                                      description: 츨입자 온도
 *                                      example: "37.5"
 *                                  access_time:
 *                                      type: string
 *                                      description: 출입 시간
 *                                      example: "2020-10-25 11:22:33"
 *                                  stb_sn:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 시리얼 번호
 *                                      example: "KSTC200708"
 *                                  stb_obid:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 obid
 *                                      example: "5fa0fddb349efc5887f04985"
 *                                  stb_name:
 *                                      type: number
 *                                      description: 사진을 찍은 단말의 이름
 *                                      example: "string"
 *                                  stb_location:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 위치
 *                                      example: "string"
 *                                  authority:
 *                                      type: string
 *                                      description: 해당 단말을 등록한 계정의 권한
 *                                      example: "admin"
 *                                  name:
 *                                      type: string
 *                                      description: 출입자 이름
 *                                      example: "unknown"
 *       put:
 *         tags:
 *         - "access"
 *         summary: "출입기록 업데이트"
 *         operationId: "updateAccess"
 *         description: "출입기록을 업데이트 합니다"
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "access obid"
 *            in: "path"
 *            description: "출입기록의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5eeab265563b45051fda7c4e'
 *            value: '5eeab265563b45051fda7c4e'
 *          - in: "body"
 *            default: json
 *            required: true
 *            type: object
 *            properties:
 *                                  create_at:
 *                                      type: string
 *                                      description: 만들어진 시간
 *                                      example: "2020-10-25 11:22:33"
 *                                  create_ut:
 *                                      type: string
 *                                      description: 만들어진 utc 시간
 *                                      example: "1604386267911"
 *                                  _id:
 *                                      type: string
 *                                      description: 출입자 obid
 *                                      example: "5fa0fddb349efc5887f04985"
 *                                  avatar_type:
 *                                      type: number
 *                                      description: 출입자 타입
 *                                      example: 1
 *                                  avatar_distance:
 *                                      type: number
 *                                      description: 사진 찍힌 거리
 *                                      example: 1.0
 *                                  avatar_file_url:
 *                                      type: string
 *                                      description: 사진 URL
 *                                      example: "http://172.16.135.112:3000/uploads/accesss/temp/20201103/KSTC2080019/KSTC2080019_%EC%82%AC%EC%9B%9018_1_36.366814_20201103155750.png"
 *                                  avatar_temperature:
 *                                      type: "string"
 *                                      description: 츨입자 온도
 *                                      example: "37.5"
 *                                  access_time:
 *                                      type: string
 *                                      description: 출입 시간
 *                                      example: "2020-10-25 11:22:33"
 *                                  stb_sn:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 시리얼 번호
 *                                      example: "KSTC200708"
 *                                  stb_obid:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 obid
 *                                      example: "5fa0fddb349efc5887f04985"
 *                                  stb_name:
 *                                      type: number
 *                                      description: 사진을 찍은 단말의 이름
 *                                      example: "string"
 *                                  stb_location:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 위치
 *                                      example: "string"
 *                                  authority:
 *                                      type: string
 *                                      description: 해당 단말을 등록한 계정의 권한
 *                                      example: "admin"
 *                                  name:
 *                                      type: string
 *                                      description: 출입자 이름
 *                                      example: "unknown"
 *         responses:
 *             "200":
 *               schema:
 *                              type: object
 *                              properties:
 *                                  create_at:
 *                                      type: string
 *                                      description: 만들어진 시간
 *                                      example: "2020-10-25 11:22:33"
 *                                  create_ut:
 *                                      type: string
 *                                      description: 만들어진 utc 시간
 *                                      example: "1604386267911"
 *                                  _id:
 *                                      type: string
 *                                      description: 출입자 obid
 *                                      example: "5fa0fddb349efc5887f04985"
 *                                  avatar_type:
 *                                      type: number
 *                                      description: 출입자 타입
 *                                      example: 1
 *                                  avatar_distance:
 *                                      type: number
 *                                      description: 사진 찍힌 거리
 *                                      example: 1.0
 *                                  avatar_file_url:
 *                                      type: string
 *                                      description: 사진 URL
 *                                      example: "http://172.16.135.112:3000/uploads/accesss/temp/20201103/KSTC2080019/KSTC2080019_%EC%82%AC%EC%9B%9018_1_36.366814_20201103155750.png"
 *                                  avatar_temperature:
 *                                      type: "string"
 *                                      description: 츨입자 온도
 *                                      example: "37.5"
 *                                  access_time:
 *                                      type: string
 *                                      description: 출입 시간
 *                                      example: "2020-10-25 11:22:33"
 *                                  stb_sn:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 시리얼 번호
 *                                      example: "KSTC200708"
 *                                  stb_obid:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 obid
 *                                      example: "5fa0fddb349efc5887f04985"
 *                                  stb_name:
 *                                      type: number
 *                                      description: 사진을 찍은 단말의 이름
 *                                      example: "string"
 *                                  stb_location:
 *                                      type: string
 *                                      description: 사진을 찍은 단말의 위치
 *                                      example: "string"
 *                                  authority:
 *                                      type: string
 *                                      description: 해당 단말을 등록한 계정의 권한
 *                                      example: "admin"
 *                                  name:
 *                                      type: string
 *                                      description: 출입자 이름
 *                                      example: "unknown"
 * 
 *    /camera:
 *       post:
 *          tags:
 *          - "camera"
 *          summary: "단말기 등록"
 *          parameters:
 *          - name: "body"
 *            in: "body"
 *            description: "단말기"
 *            default: json
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                   authority:
 *                       description: "로그인 계정의 권한"
 *                       type: string
 *                       example: 'admin'
 *                   name:
 *                       description: "단말기 명"
 *                       type: string
 *                       example: 'string'
 *                   location:
 *                       description: "단말기 위치"
 *                       type: string
 *                       example: 'string'
 *                   serial_number:
 *                       description: "단말기 시리얼 넘버"
 *                       type: string
 *                       example: 'string'
 *                   description:
 *                       description: "비고"
 *                       type: string
 *                       example: 'string'
 *          responses:
 *             "200":
 *                  schema:
 *                      type: object
 *                      properties:
 *                           _id:
 *                               description: "단말 obid"
 *                               type: string
 *                               example: '5fa0fddb349efc5887f04985'
 *                           authority:
 *                               description: "로그인 계정의 권한"
 *                               type: string
 *                               example: 'admin'
 *                           name:
 *                               description: "단말기 명"
 *                               type: string
 *                               example: 'string'
 *                           location:
 *                               description: "단말기 위치"
 *                               type: string
 *                               example: 'string'
 *                           serial_number:
 *                               description: "단말기 시리얼 넘버"
 *                               type: string
 *                               example: 'string'
 *                           description:
 *                               description: "비고"
 *                               type: string
 *                               example: 'string'
 *       get:
 *         tags:
 *         - "camera"
 *         summary: "단말기 목록 조회" 
 *         parameters:
 *          - in: "query"
 *            name: "authority"
 *            description: "로그인 계정의 권한"
 *            required: true
 *            example: 'admin'
 *         responses:
 *             "200":
 *                  schema:
 *                      type: object
 *                      properties:
 *                           authority:
 *                               description: "로그인 계정의 권한"
 *                               type: string
 *                               example: 'admin'
 *                           name:
 *                               description: "단말기 명"
 *                               type: string
 *                               example: 'string'
 *                           location:
 *                               description: "단말기 위치"
 *                               type: string
 *                               example: 'string'
 *                           serial_number:
 *                               description: "단말기 시리얼 넘버"
 *                               type: string
 *                               example: 'string'
 *                           description:
 *                               description: "비고"
 *                               type: string
 *                               example: 'string'
 *                           status:
 *                               description: "단말 ON/OFF"
 *                               type: string
 *                               example: 'Y'
 *                           create_at:
 *                               description: "단말 생성날짜"
 *                               type: string
 *                               example: 'Y'
 *                           create_ut:
 *                               description: "단말 생성 날짜 utc"
 *                               type: string
 *                               example: 'Y'
 *    /camera/{obid}:
 *       get:
 *         tags:
 *         - "camera"
 *         summary: "단말기 조회"
 *         parameters:
 *          - name: "camera obid"
 *            in: "path"
 *            description: "단말기의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee336c185f19195955a1671'
 *            value: '5ee336c185f19195955a1671'
 *         responses:
 *             "200":
 *                  schema:
 *                      type: object
 *                      properties:
 *                           authority:
 *                               description: "로그인 계정의 권한"
 *                               type: string
 *                               example: 'admin'
 *                           name:
 *                               description: "단말기 명"
 *                               type: string
 *                               example: 'string'
 *                           location:
 *                               description: "단말기 위치"
 *                               type: string
 *                               example: 'string'
 *                           serial_number:
 *                               description: "단말기 시리얼 넘버"
 *                               type: string
 *                               example: 'string'
 *                           description:
 *                               description: "비고"
 *                               type: string
 *                               example: 'string'
 *                           status:
 *                               description: "단말 ON/OFF"
 *                               type: string
 *                               example: 'Y'
 *                           create_at:
 *                               description: "단말 생성날짜"
 *                               type: string
 *                               example: 'Y'
 *                           create_ut:
 *                               description: "단말 생성 날짜 utc"
 *                               type: string
 *                               example: 'Y'
 *       put:
 *         tags:
 *         - "camera"
 *         summary: "카메라 업데이트"
 *         parameters:
 *          - name: "camera obid"
 *            in: "path"
 *            description: "단말기의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee336c185f19195955a1671'
 *            value: '5ee336c185f19195955a1671'
 *          - name: "body"
 *            in: "body"
 *            description: "단말기"
 *            default: json
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                   authority:
 *                       description: "로그인 계정의 권한"
 *                       type: string
 *                       example: 'admin'
 *                   name:
 *                       description: "단말기 명"
 *                       type: string
 *                       example: 'string'
 *                   location:
 *                       description: "단말기 위치"
 *                       type: string
 *                       example: 'string'
 *                   serial_number:
 *                       description: "단말기 시리얼 넘버"
 *                       type: string
 *                       example: 'string'
 *                   description:
 *                       description: "비고"
 *                       type: string
 *                       example: 'string'
 *         responses:
 *             "200":
 *                  schema:
 *                      type: object
 *                      properties:
 *                           _id:
 *                               description: "단말 obid"
 *                               type: string
 *                               example: '5fa0fddb349efc5887f04985'
 *                           authority:
 *                               description: "로그인 계정의 권한"
 *                               type: string
 *                               example: 'admin'
 *                           name:
 *                               description: "단말기 명"
 *                               type: string
 *                               example: 'string'
 *                           location:
 *                               description: "단말기 위치"
 *                               type: string
 *                               example: 'string'
 *                           serial_number:
 *                               description: "단말기 시리얼 넘버"
 *                               type: string
 *                               example: 'string'
 *                           description:
 *                               description: "비고"
 *                               type: string
 *                               example: 'string'
 *  
 *       delete:
 *         tags:
 *         - "camera"
 *         summary: "카메라 삭제"
 *         parameters:
 *          - name: "camera obid"
 *            in: "path"
 *            description: "단말기의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee336c185f19195955a1671'
 *            value: '5ee336c185f19195955a1671'
 *         responses:
 *             "200":
 *                  schema:
 *                      type: object
 *                      properties:
 *                           _id:
 *                               description: "단말 obid"
 *                               type: string
 *                               example: '5fa0fddb349efc5887f04985'
 *                           authority:
 *                               description: "로그인 계정의 권한"
 *                               type: string
 *                               example: 'admin'
 *                           name:
 *                               description: "단말기 명"
 *                               type: string
 *                               example: 'string'
 *                           location:
 *                               description: "단말기 위치"
 *                               type: string
 *                               example: 'string'
 *                           serial_number:
 *                               description: "단말기 시리얼 넘버"
 *                               type: string
 *                               example: 'string'
 *                           description:
 *                               description: "비고"
 *                               type: string
 *                               example: 'string'
 *                           status:
 *                               description: "단말 ON/OFF"
 *                               type: string
 *                               example: 'Y'
 *  
 *    /group:
 *       post:
 *          tags:
 *          - "group"
 *          summary: "그룹 등록"
 *          parameters:
 *          - name: "body"
 *            in: "body"
 *            description: "그룹"
 *            default: json
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                   authority:
 *                       description: "로그인 계정의 권한"
 *                       type: string
 *                       example: 'admin'
 *                   type:
 *                      description: "그룹 타입 1:사원 5:블랙리스트"
 *                      type: number
 *                      example: 1
 *                   name:
 *                       description: "그룹 이름"
 *                       type: string
 *                       example: 'string'
 *                   parent:
 *                       description: "상위 그룹의 obid 없을시 최상위 그룹으로 판단"
 *                       type: string
 *                       example: 'string'
 *          responses:
 *             "200":
 *                  schema:
 *                      type: object
 *                      properties:
 *                          authority:
 *                              description: "로그인 계정의 권한"
 *                              type: string
 *                              example: 'admin'
 *                          type:
 *                             description: "그룹 타입 1:사원 5:블랙리스트"
 *                             type: number
 *                             example: 1
 *                          name:
 *                              description: "그룹 이름"
 *                              type: string
 *                              example: 'string'
 *                          parent:
 *                              description: "상위 그룹의 obid 없을시 최상위 그룹으로 판단"
 *                              type: string
 *                              example: 'string'
 *       get:
 *          tags:
 *           - "group"
 *          summary: "그룹 목록 조회" 
 *          parameters:
 *           - name: "auth"
 *             in: "query"
 *             description: "로그인 계정의 권한"
 *             required: true
 *             example: 'admin'
 *           - name: "type"
 *             in: "query"
 *             description: "그룹 타입 1:사원 5:블랙리스트"
 *             required: true
 *             example: '[1,5]'
 *          responses:
 *             "200":
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object 
 *                      properties:
 *                          authority:
 *                              description: "로그인 계정의 권한"
 *                              type: string
 *                              example: 'admin'
 *                          type:
 *                             description: "그룹 타입 1:사원 5:블랙리스트"
 *                             type: number
 *                             example: 1
 *                          name:
 *                              description: "그룹 이름"
 *                              type: string
 *                              example: 'string'
 *                          parent:
 *                              description: "상위 그룹의 obid 없을시 최상위 그룹으로 판단"
 *                              type: string
 *                              example: 'string'
 *                          create_at:
 *                              description: "생성 날짜"
 *                              type: string
 *                              example: 'string'
 *                          create_ut:
 *                              description: "생성 날짜 utc"
 *                              type: string
 *                              example: 'string'
 *                          children:
 *                              description: "자식 그룹 obid로 저장되지만 불러올때 populate로 join필요"
 *                              type: array
 *                              items:
 *                                  type: object 
 *                                  properties:
 *                                      authority:
 *                                          description: "로그인 계정의 권한"
 *                                          type: string
 *                                          example: 'admin'
 *                                      type:
 *                                         description: "그룹 타입 1:사원 5:블랙리스트"
 *                                         type: number
 *                                         example: 1
 *                                      name:
 *                                          description: "그룹 이름"
 *                                          type: string
 *                                          example: 'string'
 *                                      parent:
 *                                          description: "상위 그룹의 obid 없을시 최상위 그룹으로 판단"
 *                                          type: string
 *                                          example: 'string'
 *                                      create_at:
 *                                          description: "생성날짜"
 *                                          type: string
 *                                          example: 'string'
 *                                      create_ut:
 *                                          description: "생성날짜 utc"
 *                                          type: string
 *                                          example: 'string'
 *                                      children:
 *                                          description: "상위 그룹의 obid 없을시 최상위 그룹으로 판단"
 *                                          
 *                                  
 *    /group/{obid}:
 *       get:
 *         tags:
 *         - "group"
 *         summary: "그룹 조회"
 *         parameters:
 *          - name: "group obid"
 *            in: "path"
 *            description: "그룹의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee982ef90799e56affe7d6a'
 *            value: '5ee982ef90799e56affe7d6a'
 *         responses:
 *             "200":
 *               schema:
 *                      type: object 
 *                      properties:
 *                          authority:
 *                              description: "로그인 계정의 권한"
 *                              type: string
 *                              example: 'admin'
 *                          type:
 *                             description: "그룹 타입 1:사원 5:블랙리스트"
 *                             type: number
 *                             example: 1
 *                          name:
 *                              description: "그룹 이름"
 *                              type: string
 *                              example: 'string'
 *                          parent:
 *                              description: "상위 그룹의 obid 없을시 최상위 그룹으로 판단"
 *                              type: string
 *                              example: 'string'
 *                          create_at:
 *                              description: "생성 날짜"
 *                              type: string
 *                              example: 'string'
 *                          create_ut:
 *                              description: "생성 날짜 utc"
 *                              type: string
 *                              example: 'string'
 *                          children:
 *                              description: "자식 그룹 obid로 저장되지만 불러올때 populate로 join필요"
 *                              type: array
 *                              items:
 *                                  type: object 
 *                                  properties:
 *                                      authority:
 *                                          description: "로그인 계정의 권한"
 *                                          type: string
 *                                          example: 'admin'
 *                                      type:
 *                                         description: "그룹 타입 1:사원 5:블랙리스트"
 *                                         type: number
 *                                         example: 1
 *                                      name:
 *                                          description: "그룹 이름"
 *                                          type: string
 *                                          example: 'string'
 *                                      parent:
 *                                          description: "상위 그룹의 obid 없을시 최상위 그룹으로 판단"
 *                                          type: string
 *                                          example: 'string'
 *                                      create_at:
 *                                          description: "생성날짜"
 *                                          type: string
 *                                          example: 'string'
 *                                      create_ut:
 *                                          description: "생성날짜 utc"
 *                                          type: string
 *                                          example: 'string'
 *                                      children:
 *                                          description: "상위 그룹의 obid 없을시 최상위 그룹으로 판단"
 *       put:
 *         tags:
 *         - "group"
 *         summary: "그룹 업데이트"
 *         parameters:
 *          - name: "group obid"
 *            in: "path"
 *            description: "그룹의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee982ef90799e56affe7d6a'
 *            value: '5ee982ef90799e56affe7d6a'
 *          - name: "name"
 *            in: "body"
 *            description: "그룹 이름"
 *            required: true
 *            type: object
 *            example: 'string'
 *         responses:
 *             "200":
 *               schema:
 *                      type: object 
 *                      properties:
 *                          authority:
 *                              description: "로그인 계정의 권한"
 *                              type: string
 *                              example: 'admin'
 *                          type:
 *                             description: "그룹 타입 1:사원 5:블랙리스트"
 *                             type: number
 *                             example: 1
 *                          name:
 *                              description: "그룹 이름"
 *                              type: string
 *                              example: 'string'
 *                          parent:
 *                              description: "상위 그룹의 obid 없을시 최상위 그룹으로 판단"
 *                              type: string
 *                              example: 'string'
 *                          create_at:
 *                              description: "생성 날짜"
 *                              type: string
 *                              example: 'string'
 *                          create_ut:
 *                              description: "생성 날짜 utc"
 *                              type: string
 *                              example: 'string'
 *                          children:
 *                              description: "자식 그룹 obid로 저장되지만 불러올때 populate로 join필요"
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  example: "5ee982ef90799e56affe7d6a"
 *       delete:
 *         tags:
 *         - "group"
 *         summary: "그룹 삭제 하위그룹, 소속된 사용자도 모두 제거"
 *         parameters:
 *          - name: "group obid"
 *            in: "path"
 *            description: "그룹의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee982ef90799e56affe7d6a'
 *            value: '5ee982ef90799e56affe7d6a'
 *         responses:
 *             "200":
 *               schema:
 *                      type: object 
 *                      properties:
 *                          authority:
 *                              description: "로그인 계정의 권한"
 *                              type: string
 *                              example: 'admin'
 *                          type:
 *                             description: "그룹 타입 1:사원 5:블랙리스트"
 *                             type: number
 *                             example: 1
 *                          name:
 *                              description: "그룹 이름"
 *                              type: string
 *                              example: 'string'
 *                          parent:
 *                              description: "상위 그룹의 obid 없을시 최상위 그룹으로 판단"
 *                              type: string
 *                              example: 'string'
 *                          create_at:
 *                              description: "생성 날짜"
 *                              type: string
 *                              example: 'string'
 *                          create_ut:
 *                              description: "생성 날짜 utc"
 *                              type: string
 *                              example: 'string'
 *                          children:
 *                              description: "자식 그룹 obid로 저장되지만 불러올때 populate로 join필요"
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  example: "5ee982ef90799e56affe7d6a"
 *    /operation:
 *       post:
 *          tags:
 *          - "operation"
 *          summary: "계정의 작업 기록 등록"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "계정의 작업 기록 등록"
 *            required: true
 *            schema:
 *              $ref: "#/definitions/Operation"
 *          responses:
 *             "200":
 *               schema:
 *                   $ref: "#/definitions/Operation"
 *       get:
 *         tags:
 *         - "operation"
 *         summary: "계정의 작업 기록 목록 조회" 
 *         responses:
 *             "200":
 *               schema:
 *                   $ref: "#/definitions/Operation"
 *    /operation/{obid}:
 *       get:
 *         tags:
 *         - "operation"
 *         summary: "계정의 작업 기록 조회"
 *         parameters:
 *          - name: "operation obid"
 *            in: "path"
 *            description: "계정의 작업 기록 의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30890de50a9bd790644ec'
 *            value: '5ee30890de50a9bd790644ec'
 *         responses:
 *             "200":
 *               schema:
 *                   $ref: "#/definitions/Operation"
 *       put:
 *         tags:
 *         - "operation"
 *         summary: "계정의 작업 기록 업데이트"
 *         parameters:
 *          - name: "operation obid"
 *            in: "path"
 *            description: "계정의 작업 기록의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30890de50a9bd790644ec'
 *            value: '5ee30890de50a9bd790644ec'
 *         responses:
 *             "200":
 *               schema:
 *                   $ref: "#/definitions/Operation"
 *       delete:
 *         tags:
 *         - "operation"
 *         summary: "계정의 작업 기록 삭제"
 *         parameters:
 *          - name: "operation obid"
 *            in: "path"
 *            description: "계정의 작업 기록의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30890de50a9bd790644ec'
 *            value: '5ee30890de50a9bd790644ec'
 *         responses:
 *             "200":
 *               schema:
 *                   $ref: "#/definitions/Operation"
 *  
 *    /user:
 *       post:
 *          tags:
 *          - "user"
 *          summary: "사용자 등록"
 *          parameters:
 *          - in: "body"
 *            name: "authority"
 *            description: "로그인 계정의 권한"
 *            required: true
 *            example: 'admin'
 *            schema:
 *              type: object
 *              properties:
 *                  name:
 *                    description: "이름"
 *                    required: false
 *                    example: 'string'
 *                  
 *                  location:
 *                    description: "근무지"
 *                    required: false
 *                    example: 'string'
 *                  
 *                  department_id:
 *                    description: "부서"
 *                    required: false
 *                    example: 'string'
 *                  
 *                  position:
 *                    description: "직급"
 *                    required: false
 *                    example: 'string'
 *                  
 *                  type:
 *                    description: "타입 1:사원, 5:블랙리스트"
 *                    required: true
 *                    example: 1
 *                  
 *                  gender:
 *                    description: "성별 1:남자 2:여자"
 *                    required: true
 *                    example: 1
 *                  
 *                  groups_obids:
 *                    description: "소속된 그룹의 obid"
 *                    type: "array"
 *                    format: "array"
 *                    required: true
 *                    example: ["5f992a7499d09d11aeac37a6"]
 *          responses:
 *             "200":
 *               schema:
 *                   type: object
 *                   properties:
 *                       name:
 *                         description: "이름"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       location:
 *                         description: "근무지"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       department_id:
 *                         description: "부서"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       position:
 *                         description: "직급"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       type:
 *                         description: "타입 1:사원, 5:블랙리스트"
 *                         required: true
 *                         example: 1
 *                       
 *                       gender:
 *                         description: "성별 1:남자 2:여자"
 *                         required: true
 *                         example: 1
 *                       
 *                       groups_obids:
 *                         description: "소속된 그룹의 obid"
 *                         type: "array"
 *                         format: "array"
 *                         required: true
 *                         example: ["5f992a7499d09d11aeac37a6"]
 *       get:
 *         tags:
 *          - "user"
 *         summary: "사용자 목록 조회" 
 *         parameters:
 *           - in: "query"
 *             name: "auth"
 *             description: "로그인 계정의 권한"
 *             required: true
 *             example: 'admin'
 *           - in: "query"
 *             name: "rowsPerPage"
 *             description: "페이지당 표시 갯수"
 *             required: true
 *             example: 'admin'
 *           - in: "query"
 *             name: "page"
 *             description: "페이지"
 *             required: true
 *             example: 'admin'
 *           - in: "query"
 *             name: "searchType"
 *             description: "검색할 항목"
 *             required: true
 *             example: 'admin'
 *           - in: "query"
 *             name: "searchType"
 *             description: "검색할 항목"
 *             required: true
 *             example: 'admin'
 *           - in: "query"
 *             name: "type"
 *             description: "사용자 타입 1:사원 5:블랙리스트"
 *             required: true
 *             example: '[1,5]'
 *           - in: "query"
 *             name: "group_obid"
 *             description: "그룹 OBID"
 *             required: true
 *             example: '5f992a7499d09d11aeac37a6'
 *           - in: "query"
 *             name: "entered"
 *             description: "입사일"
 *             required: true
 *             example: '2020-10-10'
 *         responses:
 *             "200":
 *               schema:
 *                   type: object
 *                   properties:
 *                       count:
 *                         description: "검색조건에 맞는 사용자 수"
 *                         required: false
 *                         example: 8
 *                       data:
 *                         description: "사용자 목록"
 *                         required: false
 *                         type: array
 *                         items:
 *                            type: object
 *                            properties:
 *                                  name:
 *                                    description: "이름"
 *                                    required: false
 *                                    example: 'string'
 *                                  
 *                                  location:
 *                                    description: "근무지"
 *                                    required: false
 *                                    example: 'string'
 *                                  
 *                                  department_id:
 *                                    description: "부서"
 *                                    required: false
 *                                    example: 'string'
 *                                  
 *                                  position:
 *                                    description: "직급"
 *                                    required: false
 *                                    example: 'string'
 *                                  
 *                                  type:
 *                                    description: "타입 1:사원, 5:블랙리스트"
 *                                    required: true
 *                                    example: 1
 *                                  
 *                                  gender:
 *                                    description: "성별 1:남자 2:여자"
 *                                    required: true
 *                                    example: 1
 *                                  
 *                                  groups_obids:
 *                                    description: "소속된 그룹의 obid"
 *                                    type: "array"
 *                                    format: "array"
 *                                    required: true
 *                                    example: ["5f992a7499d09d11aeac37a6"]
 *    /user/{obid}:
 *       get:
 *         tags:
 *         - "user"
 *         summary: "사용자 조회"
 *         parameters:
 *          - name: "user obid"
 *            in: "path"
 *            description: "사용자의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee9db4360497f4ee3dd0f4f'
 *            value: '5ee9db4360497f4ee3dd0f4f'
 *         responses:
 *             "200":
 *               schema:
 *                   type: object
 *                   properties:
 *                       name:
 *                         description: "이름"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       location:
 *                         description: "근무지"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       department_id:
 *                         description: "부서"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       position:
 *                         description: "직급"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       type:
 *                         description: "타입 1:사원, 5:블랙리스트"
 *                         required: true
 *                         example: 1
 *                       
 *                       gender:
 *                         description: "성별 1:남자 2:여자"
 *                         required: true
 *                         example: 1
 *                       
 *                       groups_obids:
 *                         description: "소속된 그룹의 obid"
 *                         type: "array"
 *                         format: "array"
 *                         required: true
 *                         example: ["5f992a7499d09d11aeac37a6"]
 *       put:
 *         tags:
 *         - "user"
 *         summary: "사용자 업데이트"
 *         parameters:
 *          - name: "user obid"
 *            in: "path"
 *            description: "사용자의 mongodb obid"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee9db4360497f4ee3dd0f4f'
 *            value: '5ee9db4360497f4ee3dd0f4f'
 *         responses:
 *             "200":
 *               schema:
 *                   type: object
 *                   properties:
 *                       name:
 *                         description: "이름"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       location:
 *                         description: "근무지"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       department_id:
 *                         description: "부서"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       position:
 *                         description: "직급"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       type:
 *                         description: "타입 1:사원, 5:블랙리스트"
 *                         required: true
 *                         example: 1
 *                       
 *                       gender:
 *                         description: "성별 1:남자 2:여자"
 *                         required: true
 *                         example: 1
 *                       
 *                       groups_obids:
 *                         description: "소속된 그룹의 obid"
 *                         type: "array"
 *                         format: "array"
 *                         required: true
 *                         example: ["5f992a7499d09d11aeac37a6"]
 *       delete:
 *         tags:
 *         - "user"
 *         summary: "사용자 삭제"
 *         parameters:
 *          - name: "selectedData"
 *            in: "path"
 *            description: "사용자의 mongodb_obids"
 *            required: true
 *            example: '5ee9db4360497f4ee3dd0f4f'

 *         responses:
 *             "200":
 *               schema:
 *                   type: object
 *                   properties:
 *                       name:
 *                         description: "이름"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       location:
 *                         description: "근무지"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       department_id:
 *                         description: "부서"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       position:
 *                         description: "직급"
 *                         required: false
 *                         example: 'string'
 *                       
 *                       type:
 *                         description: "타입 1:사원, 5:블랙리스트"
 *                         required: true
 *                         example: 1
 *                       
 *                       gender:
 *                         description: "성별 1:남자 2:여자"
 *                         required: true
 *                         example: 1
 *                       
 *                       groups_obids:
 *                         description: "소속된 그룹의 obid"
 *                         type: "array"
 *                         format: "array"
 *                         required: true
 *                         example: ["5f992a7499d09d11aeac37a6"]
 *  
 */