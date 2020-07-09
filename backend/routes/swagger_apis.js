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
 *           
 *         responses:
 *             "200":
 *               description: "로그인 성공"
 *               schema:
 *                  type: object
 *                  properties:
 *                      token:
 *                          type: string
 *                          example: JWT
 *             "400":
 *               description: "로그인 실패"
 *               schema:
 *                  type: object
 *                  properties:
 *                      err:
 *                          type: string
 *                          example: 존재하지 않는 계정입니다
 *    /auth:
 *       post:
 *         tags:
 *         - "account"
 *         summary: "유효 토큰 인증"
 *         description: "사용자의 토큰이 인증된 토큰인지 검사합니다"
 *         operationId: "auth"
 *         produces:
 *         - "application/json"
 *         parameters:
 *         - name: "body"
 *           in: "body"
 *           description: "토큰"
 *           default: json
 *           required: true
 *           type: object
 *           properties:
 *              token:
 *                  type: string
 *                  example: 'JWT'
 *         responses:
 *             "200":
 *               description: "인증 성공"
 *               schema:
 *                  type: object
 *                  properties:
 *                      auth:
 *                          type: boolean
 *                          example: true
 *                      user_id:
 *                          type: string
 *                          example: mongodb _id
 *             "400":
 *               description: "인증 실패"
 *               schema:
 *                  type: object
 *                  properties:
 *                      auth:
 *                          type: boolean
 *                          example: false
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
 *            type: object
 *            properties:
 *              user_id:
 *                  type: string
 *                  example: 'string'
 *              user_pw:
 *                  type: string
 *                  example: 'string'
 *              user_name:
 *                  type: string
 *                  example: 'string'
 *              user_lang:
 *                  type: string
 *                  example: 'string' 
 *       get:
 *         tags:
 *         - "account"
 *         summary: "계정 목록"
 *         operationId: "getAccountList"
 *         description: "모든 계정 목록을 불러옵니다 비밀번호는 포함되지 않습니다."
 *         produces:
 *         - "application/json"
 *         parameters: []
 *         responses:
 *             "200":
 *               description: "계정 목록"
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                  example: [{"user_name":"string","user_id":"string","user_lang":"string"}]
 *    /account/{id}:
 *       get:
 *         tags:
 *         - "account"
 *         summary: "계정"
 *         operationId: "getAccount"
 *         description: "모든 계정을 불러옵니다 비밀번호는 포함되지 않습니다."
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "account _id"
 *            in: "path"
 *            description: "계정의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5efae2fa1718abd4478795b9'
 *            value: '5efae2fa1718abd4478795b9'
 *         responses:
 *             "200":
 *               description: "계정 검색 성공"
 *               schema:
 *                  type: object
 *                  properties:
 *                     user_id:
 *                         type: string
 *                         example: 'string'
 *                     user_name:
 *                         type: string
 *                         example: 'string'
 *                     user_lang:
 *                         type: string
 *                         example: 'string'
 *       put:
 *         tags:
 *         - "account"
 *         summary: "계정 업데이트"
 *         operationId: "updateAccount"
 *         description: "계정을 업데이트 합니다"
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "account _id"
 *            in: "path"
 *            description: "계정의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5efae2fa1718abd4478795b9'
 *            value: '5efae2fa1718abd4478795b9'
 *          - in: "body"
 *            default: json
 *            required: true
 *            type: object
 *            properties:
 *              user_id:
 *                  type: string
 *                  example: 'string'
 *              user_pw:
 *                  type: string
 *                  example: 'string'
 *              user_name:
 *                  type: string
 *                  example: 'string'
 *              user_lang:
 *                  type: string
 *                  example: 'string' 
 *         responses:
 *             "200":
 *               description: "계정 업데이트 성공"
 *               schema:
 *                  type: object
 *                  properties:
 *                     user_id:
 *                         type: string
 *                         example: 'string'
 *                     user_name:
 *                         type: string
 *                         example: 'string'
 *                     user_lang:
 *                         type: string
 *                         example: 'string'
 *       delete:
 *         tags:
 *         - "account"
 *         summary: "계정 삭제"
 *         operationId: "deleteAccount"
 *         description: "계정을 삭제합니다."
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "account _id"
 *            in: "path"
 *            description: "계정의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5efae2fa1718abd4478795b9'
 *            value: '5efae2fa1718abd4478795b9'
 *         responses:
 *             "200":
 *               description: "계정 삭제 성공"
 *               schema:
 *                  type: object
 *                  properties:
 *                     user_id:
 *                         type: string
 *                         example: 'string'
 *                     user_name:
 *                         type: string
 *                         example: 'string'
 *                     user_lang:
 *                         type: string
 *                         example: 'string'
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
 *            default: json
 *            required: true
 *            type: object
 *            properties:
 *              create_at:
 *                  type: string
 *                  example: 'string'
 *              avatar_file:
 *                  type: string
 *                  example: 'string'
 *              avatar_file_checksum:
 *                  type: string
 *                  example: 'string'
 *              avatar_type:
 *                  type: intger
 *                  example: 1
 *              avatar_contraction_data:
 *                  type: string
 *                  example: 'string'
 *              avatar_file_url:
 *                  type: string
 *                  example: 'string'
 *              user_obid:
 *                  type: string
 *                  example: "string"
 *              avatar_temperature:
 *                  type: number
 *                  example: 0
 *              access_time:
 *                  type: string
 *                  example: 'string'
 *              create_ut:
 *                  type: string
 *                  example: 'string'
 *       get:
 *         tags:
 *         - "access"
 *         summary: "출입 기록 목록 조회"
 *         operationId: "getAccess"
 *         responses:
 *             "200":
 *               description: "출입 기록 목록"
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                  example: [{"create_at":"2020-06-17 18:10:13","avatar_file":"string","avatar_file_checksum":"string","avatar_type":1,"avatar_contraction_data":"string","avatar_file_url":"string","user_obid":"5ee30c06de50a90f050644ef","avatar_temperature":36.1,"access_time":"2020-06-18 00:16:37","create_ut":"1592439397743"}]
 *    /access?type=1,2,5:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "?type=1,2,5 각각 사원,방문자,블랙리스트 출입 기록"
 *         operationId: "type"
 *         responses:
 *             "200":
 *               description: "타입별 목록"
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                  example: [{"create_at":"2020-06-17 18:10:13","avatar_file":"string","avatar_file_checksum":"string","avatar_type":1,"avatar_contraction_data":"string","avatar_file_url":"string","user_obid":"5ee30c06de50a90f050644ef","avatar_temperature":36.1,"access_time":"2020-06-18 00:16:37","create_ut":"1592439397743"}]
 *    /access?type=todayStatistics:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "?type=todayStatistics 오늘 출입자 타입별 카운트"
 *         operationId: "todayStatistics"
 *         responses:
 *             "200":
 *               description: "타입별 목록"
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                  example: [
 *                       {
 *                          _id: {
 *                              type: 3
 *                          },
 *                          count: 5
 *                       },
 *                       {
 *                          _id: {
 *                              type: 1
 *                          },
 *                          count: 1
 *                       }
 *                   ]
 *    /access?type=todayAttendance:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "?type=todayAttendance 오늘 출근한 사원 시간대 목록"
 *         operationId: "todayAttendance"
 *         responses:
 *             "200":
 *               description: "타입별 목록"
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                  example: [
 *                      {
 *                          _id: {
 *                          avatar_contraction_data: "string",
 *                          avatar_type: 1
 *                      },
 *                          access_time: "2020-07-06 09:30:05",
 *                          count: 1
 *                      },
 *                      {
 *                          _id: {
 *                          avatar_contraction_data: "string",
 *                          avatar_type: 1
 *                      },
 *                          access_time: "2020-07-06 08:50:17",
 *                          count: 1
 *                      },
 *                      {
 *                          _id: {
 *                          avatar_contraction_data: "string",
 *                          avatar_type: 1
 *                      },
 *                          access_time: "2020-07-06 09:22:55",
 *                          count: 1
 *                      }
 *                  ]
 *    /access?type=temperature:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "??type=temperature 온도 38도 이상의 출입자 4명 목록"
 *         operationId: "temperature"
 *         responses:
 *             "200":
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                  example: [
 * {
 * _id: "5ef19cedbc752801bf35b103",
 * avatar_type: 3,
 * avatar_file_url: "string",
 * avatar_temperature: "38.355896",
 * access_time: "2020-06-23 15:10:52"
 * },
 * {
 * _id: "5ef1958abc752801bf35b059",
 * avatar_type: 3,
 * avatar_file_url: "string",
 * avatar_temperature: "38.470856",
 * access_time: "2020-06-23 14:39:22"
 * },
 * {
 * _id: "5ef1956ebc752801bf35b04f",
 * avatar_type: 3,
 * avatar_file_url: "string",
 * avatar_temperature: "38.606956",
 * access_time: "2020-06-23 14:38:53"
 * },
 * {
 * _id: "5ef19484bc752801bf35b029",
 * avatar_type: 3,
 * avatar_file_url: "string",
 * avatar_temperature: "38.486126",
 * access_time: "2020-06-23 14:35:00"
 * }
 * ]
  *    /access?type=attendance:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "??type=attendance 사원 출입 기록"
 *         operationId: "attendance"
 *         responses:
 *             "200":
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                  example: [
 * {
 * _id: "5eeab2f7c386f605375ec142",
 * count: 0,
 * create_at: "2020-06-18 09:17:33",
 * avatar_type: 1,
 * avatar_contraction_data: "string",
 * avatar_file_url: "string",
 * user_obid: "5ee30c06de50a90f050644ef",
 * avatar_temperature: "0.0",
 * access_time: "2020-06-18 00:19:02",
 * create_ut: "1592439543361",
 * },
 * ]
 *    /access/{id}:
 *       get:
 *         tags:
 *         - "access"
 *         summary: "출입 기록 조회"
 *         description: "출입 기록을 불러옵니다"
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "access _id"
 *            in: "path"
 *            description: "출입 기록의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5eeab265563b45051fda7c4e'
 *            value: '5eeab265563b45051fda7c4e'
 *         responses:
 *             "200":
 *               description: "검색 성공"
 *               schema:
 *                  type: object
 *                  properties:
 *                    create_at:
 *                        type: string
 *                        example: 'string'
 *                    avatar_file:
 *                        type: string
 *                        example: 'string'
 *                    avatar_file_checksum:
 *                        type: string
 *                        example: 'string'
 *                    avatar_type:
 *                        type: intger
 *                        example: 0
 *                    avatar_contraction_data:
 *                        type: string
 *                        example: 'string'
 *                    avatar_file_url:
 *                        type: string
 *                        example: 'string'
 *                    user_obid:
 *                        type: string
 *                        example: "string"
 *                    avatar_temperature:
 *                        type: number
 *                        example: 0
 *                    access_time:
 *                        type: string
 *                        example: 'string'
 *                    create_ut:
 *                        type: string
 *                        example: 'string'
 *       put:
 *         tags:
 *         - "access"
 *         summary: "출입기록 업데이트"
 *         operationId: "updateAccess"
 *         description: "출입기록을 업데이트 합니다"
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "access _id"
 *            in: "path"
 *            description: "출입기록의 mongodb _id"
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
 *                create_at:
 *                    type: string
 *                    example: 'string'
 *                avatar_file:
 *                    type: string
 *                    example: 'string'
 *                avatar_file_checksum:
 *                    type: string
 *                    example: 'string'
 *                avatar_type:
 *                    type: intger
 *                    example: 0
 *                avatar_contraction_data:
 *                    type: string
 *                    example: 'string'
 *                avatar_file_url:
 *                    type: string
 *                    example: 'string'
 *                user_obid:
 *                    type: string
 *                    example: "string"
 *                avatar_temperature:
 *                    type: number
 *                    example: 0
 *                access_time:
 *                    type: string
 *                    example: 'string'
 *                create_ut:
 *                    type: string
 *                    example: 'string' 
 *         responses:
 *             "200":
 *               description: "계정 업데이트 성공"
 *               schema:
 *                  type: object
 *                  properties:
 *                    create_at:
 *                        type: string
 *                        example: 'string'
 *                    avatar_file:
 *                        type: string
 *                        example: 'string'
 *                    avatar_file_checksum:
 *                        type: string
 *                        example: 'string'
 *                    avatar_type:
 *                        type: intger
 *                        example: 0
 *                    avatar_contraction_data:
 *                        type: string
 *                        example: 'string'
 *                    avatar_file_url:
 *                        type: string
 *                        example: 'string'
 *                    user_obid:
 *                        type: string
 *                        example: "string"
 *                    avatar_temperature:
 *                        type: number
 *                        example: 0
 *                    access_time:
 *                        type: string
 *                        example: 'string'
 *                    create_ut:
 *                        type: string
 *                        example: 'string'
 *       delete:
 *         tags:
 *         - "access"
 *         summary: "출입 기록 삭제"
 *         operationId: "deleteAccount"
 *         description: "출입 기록을 삭제합니다."
 *         produces:
 *         - "application/json"
 *         parameters:
 *          - name: "access _id"
 *            in: "path"
 *            description: "출입 기록의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5eeab265563b45051fda7c4e'
 *            value: '5eeab265563b45051fda7c4e'
 *         responses:
 *             "200":
 *               description: "출입 기록 삭제 성공"
 *               schema:
 *                  type: object
 *                  properties:
 *                    create_at:
 *                        type: string
 *                        example: 'string'
 *                    avatar_file:
 *                        type: string
 *                        example: 'string'
 *                    avatar_file_checksum:
 *                        type: string
 *                        example: 'string'
 *                    avatar_type:
 *                        type: intger
 *                        example: 0
 *                    avatar_contraction_data:
 *                        type: string
 *                        example: 'string'
 *                    avatar_file_url:
 *                        type: string
 *                        example: 'string'
 *                    user_obid:
 *                        type: string
 *                        example: "string"
 *                    avatar_temperature:
 *                        type: number
 *                        example: 0
 *                    access_time:
 *                        type: string
 *                        example: 'string'
 *                    create_ut:
 *                        type: string
 *                        example: 'string'
 * 
 *    /camera:
 *       post:
 *          tags:
 *          - "camera"
 *          summary: "단말기 등록"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "단말기 등록"
 *            required: true
 *            schema:
 *              $ref: "#/definitions/Camera"
 *       get:
 *         tags:
 *         - "camera"
 *         summary: "단말기 목록 조회" 
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Camera"
 *    /camera/{id}:
 *       get:
 *         tags:
 *         - "camera"
 *         summary: "단말기 조회"
 *         parameters:
 *          - name: "camera _id"
 *            in: "path"
 *            description: "단말기의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee336c185f19195955a1671'
 *            value: '5ee336c185f19195955a1671'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Camera"    
 *       put:
 *         tags:
 *         - "camera"
 *         summary: "카메라 업데이트"
 *         parameters:
 *          - name: "camera _id"
 *            in: "path"
 *            description: "단말기의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee336c185f19195955a1671'
 *            value: '5ee336c185f19195955a1671'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Camera" 
 *       delete:
 *         tags:
 *         - "camera"
 *         summary: "카메라 삭제"
 *         parameters:
 *          - name: "camera _id"
 *            in: "path"
 *            description: "단말기의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee336c185f19195955a1671'
 *            value: '5ee336c185f19195955a1671'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Camera" 
 *
 *    /camera_monitor:
 *       post:
 *          tags:
 *          - "camera_monitor"
 *          summary: "단말기 등록"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "단말기 등록"
 *            required: true
 *            schema:
 *              $ref: "#/definitions/Camera_monitor"
 *       get:
 *         tags:
 *         - "camera_monitor"
 *         summary: "단말기 목록 조회" 
 *         responses:
 *          "200":
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/definitions/Camera_monitor"
 *    /camera_monitor?id=one_device:
 *       get:
 *         tags:
 *         - "camera_monitor"
 *         summary: "각 단말기당 가장 최근에 찍힌 사진" 
 *         responses:
 *             "200":
 *               schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                  example: [
 *                      {
 *                          _id: {
 *                              camera_obids: "5ee309b5de50a9b8c80644ee",
 *                              serial_number: "KSU0000000"
 *                          },
 *                          lastDate: "2020-06-15 05:39:41",
 *                          upload_url: "http://172.16.135.89:3000/uploads/monitor/20200616/KSU0000000/KSU0000000_20200616050628.png",
 *                          count: 8642,
 *                      }
 *                  ]
 *    /camera_monitor?id=_id:
 *       get:
 *         tags:
 *         - "camera_monitor"
 *         summary: "한 단말기의 모든 스크린샷 조회" 
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Camera_monitor"
 *    /camera_monitor/{id}:
 *       get:
 *         tags:
 *         - "camera_monitor"
 *         summary: "단말기 조회"
 *         parameters:
 *          - name: "camera_monitor _id"
 *            in: "path"
 *            description: "단말기의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee336c185f19195955a1671'
 *            value: '5ee336c185f19195955a1671'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Camera_monitor"    
 *       put:
 *         tags:
 *         - "camera_monitor"
 *         summary: "카메라 업데이트"
 *         parameters:
 *          - name: "camera_monitor _id"
 *            in: "path"
 *            description: "단말기의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee336c185f19195955a1671'
 *            value: '5ee336c185f19195955a1671'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Camera_monitor" 
 *       delete:
 *         tags:
 *         - "camera_monitor"
 *         summary: "카메라 삭제"
 *         parameters:
 *          - name: "camera_monitor _id"
 *            in: "path"
 *            description: "단말기의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee336c185f19195955a1671'
 *            value: '5ee336c185f19195955a1671'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Camera_monitor" 
 * 
 *    /glogs:
 *       post:
 *          tags:
 *          - "glogs"
 *          summary: "단말기 로그 등록"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "단말기 로그 등록"
 *            required: true
 *            schema:
 *              $ref: "#/definitions/Glogs"
 *       get:
 *         tags:
 *         - "glogs"
 *         summary: "단말기 로그 목록 조회" 
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Glogs"
 *    /glogs?type=error:
 *       get:
 *         tags:
 *         - "glogs"
 *         summary: "?type=error 단말기의 에러 로그만 출력, \n ?type=limit5errors 단말기의 에러로그 5개 까지만 출력"
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Glogs"
 *    /glogs?type=limit5errors:
 *       get:
 *         tags:
 *         - "glogs"
 *         summary: "?type=limit5errors 단말기의 에러로그 5개 까지만 출력"
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Glogs"
 *    /glogs/{id}:
 *       get:
 *         tags:
 *         - "glogs"
 *         summary: "단말기 로그 조회"
 *         parameters:
 *          - name: "glog _id"
 *            in: "path"
 *            description: "단말기의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ef949697bda370108b5f89d'
 *            value: '5ef949697bda370108b5f89d'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Glog" 
 *       put:
 *         tags:
 *         - "glogs"
 *         summary: "단말기 로그 업데이트"
 *         parameters:
 *          - name: "glog _id"
 *            in: "path"
 *            description: "단말기의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ef949697bda370108b5f89d'
 *            value: '5ef949697bda370108b5f89d'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Glog" 
 *       delete:
 *         tags:
 *         - "glogs"
 *         summary: "단말기 로그 삭제"
 *         parameters:
 *          - name: "glog _id"
 *            in: "path"
 *            description: "단말기의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ef949697bda370108b5f89d'
 *            value: '5ef949697bda370108b5f89d'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Glog" 
 * 
 *    /gateway:
 *       post:
 *          tags:
 *          - "gateway"
 *          summary: "게이트 웨이 등록"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "게이트 웨이 등록"
 *            required: true
 *            schema:
 *              $ref: "#/definitions/Gateway"
 *       get:
 *         tags:
 *         - "gateway"
 *         summary: "게이트 웨이 목록 조회" 
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Gateway" 
 *    /gateway/{id}:
 *       get:
 *         tags:
 *         - "gateway"
 *         summary: "게이트웨이 조회"
 *         parameters:
 *          - name: "gateway _id"
 *            in: "path"
 *            description: "게이트웨이의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30969de50a931f80644ed'
 *            value: '5ee30969de50a931f80644ed'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Gateway" 
 *       put:
 *         tags:
 *         - "gateway"
 *         summary: "게이트웨이 업데이트"
 *         parameters:
 *          - name: "gateway _id"
 *            in: "path"
 *            description: "게이트웨이의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30969de50a931f80644ed'
 *            value: '5ee30969de50a931f80644ed'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Gateway" 
 *       delete:
 *         tags:
 *         - "gateway"
 *         summary: "게이트웨이 삭제"
 *         parameters:
 *          - name: "gateway _id"
 *            in: "path"
 *            description: "게이트웨이의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30969de50a931f80644ed'
 *            value: '5ee30969de50a931f80644ed'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Gateway" 
 * 
 *    /group:
 *       post:
 *          tags:
 *          - "group"
 *          summary: "그룹 등록"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "그룹 등록"
 *            required: true
 *            schema:
 *              $ref: "#/definitions/Group"
 *       get:
 *         tags:
 *         - "group"
 *         summary: "그룹 목록 조회" 
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Group" 
 *    /group?type=1:
 *       get:
 *         tags:
 *         - "group"
 *         summary: "?type=1 사원 그룹, ?type=2 방문자 그룹, ?type=5 블랙리스트 그룹" 
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Group" 
 *    /group/{id}:
 *       get:
 *         tags:
 *         - "group"
 *         summary: "그룹 조회"
 *         parameters:
 *          - name: "group _id"
 *            in: "path"
 *            description: "그룹의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee982ef90799e56affe7d6a'
 *            value: '5ee982ef90799e56affe7d6a'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Group" 
 *       put:
 *         tags:
 *         - "group"
 *         summary: "그룹 업데이트"
 *         parameters:
 *          - name: "group _id"
 *            in: "path"
 *            description: "그룹의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee982ef90799e56affe7d6a'
 *            value: '5ee982ef90799e56affe7d6a'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Group" 
 *       delete:
 *         tags:
 *         - "group"
 *         summary: "그룹 삭제"
 *         parameters:
 *          - name: "group _id"
 *            in: "path"
 *            description: "그룹의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee982ef90799e56affe7d6a'
 *            value: '5ee982ef90799e56affe7d6a'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Group" 
 * 
 *    /history:
 *       post:
 *          tags:
 *          - "history"
 *          summary: "사용자 CRUD 기록 등록"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "사용자 CRUD 기록 등록"
 *            required: true
 *            schema:
 *              $ref: "#/definitions/History"
 *       get:
 *         tags:
 *         - "history"
 *         summary: "사용자 CRUD 기록 목록 조회"
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/History" 
 *    /history/{id}:
 *       get:
 *         tags:
 *         - "history"
 *         summary: "사용자 CRUD 기록 조회"
 *         parameters:
 *          - name: "history _id"
 *            in: "path"
 *            description: "사용자 CRUD 기록 의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ef02d86b4ea4066f0425a78'
 *            value: '5ef02d86b4ea4066f0425a78'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/History" 
 *       put:
 *         tags:
 *         - "history"
 *         summary: "사용자 CRUD 기록 업데이트"
 *         parameters:
 *          - name: "history _id"
 *            in: "path"
 *            description: "사용자 CRUD 기록의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ef02d86b4ea4066f0425a78'
 *            value: '5ef02d86b4ea4066f0425a78'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/History" 
 *       delete:
 *         tags:
 *         - "history"
 *         summary: "사용자 CRUD 기록 삭제"
 *         parameters:
 *          - name: "history _id"
 *            in: "path"
 *            description: "사용자 CRUD 기록의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ef02d86b4ea4066f0425a78'
 *            value: '5ef02d86b4ea4066f0425a78'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/History" 
 * 
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
 *       get:
 *         tags:
 *         - "operation"
 *         summary: "계정의 작업 기록 목록 조회" 
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Operation" 
 
 *    /operation/{id}:
 *       get:
 *         tags:
 *         - "operation"
 *         summary: "계정의 작업 기록 조회"
 *         parameters:
 *          - name: "operation _id"
 *            in: "path"
 *            description: "계정의 작업 기록 의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30890de50a9bd790644ec'
 *            value: '5ee30890de50a9bd790644ec'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Operation" 
 *       put:
 *         tags:
 *         - "operation"
 *         summary: "계정의 작업 기록 업데이트"
 *         parameters:
 *          - name: "operation _id"
 *            in: "path"
 *            description: "계정의 작업 기록의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30890de50a9bd790644ec'
 *            value: '5ee30890de50a9bd790644ec'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Operation" 
 *       delete:
 *         tags:
 *         - "operation"
 *         summary: "계정의 작업 기록 삭제"
 *         parameters:
 *          - name: "operation _id"
 *            in: "path"
 *            description: "계정의 작업 기록의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30890de50a9bd790644ec'
 *            value: '5ee30890de50a9bd790644ec'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Operation" 
 * 
 *    /statistics:
 *       post:
 *          tags:
 *          - "statistics"
 *          summary: "날짜별 출입 통계 등록"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "날짜별 출입 통계 등록"
 *            required: true
 *            schema:
 *              $ref: "#/definitions/Statistics"
 *       get:
 *         tags:
 *         - "statistics"
 *         summary: "날짜별 출입 통계 목록 조회" 
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Statistics" 
 *    /statistics/{id}:
 *       get:
 *         tags:
 *         - "statistics"
 *         summary: "계정의 작업 기록 조회"
 *         parameters:
 *          - name: "statistics _id"
 *            in: "path"
 *            description: "계정의 작업 기록 의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5f026e3d3f35820109995e24'
 *            value: '5f026e3d3f35820109995e24'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Statistics" 
 *       put:
 *         tags:
 *         - "statistics"
 *         summary: "계정의 작업 기록 업데이트"
 *         parameters:
 *          - name: "statistics _id"
 *            in: "path"
 *            description: "계정의 작업 기록의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5f026e3d3f35820109995e24'
 *            value: '5f026e3d3f35820109995e24'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Statistics" 
 *       delete:
 *         tags:
 *         - "statistics"
 *         summary: "계정의 작업 기록 삭제"
 *         parameters:
 *          - name: "statistics _id"
 *            in: "path"
 *            description: "계정의 작업 기록의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5f026e3d3f35820109995e24'
 *            value: '5f026e3d3f35820109995e24'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Statistics"
 * 
 *    /user:
 *       post:
 *          tags:
 *          - "user"
 *          summary: "사용자 등록"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "사용자 등록"
 *            required: true
 *            schema:
 *              $ref: "#/definitions/User"
 *       get:
 *         tags:
 *         - "user"
 *         summary: "사용자 목록 조회" 
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/User" 
 *    /user?type=1:
 *       get:
 *         tags:
 *         - "user"
 *         summary: "?type=1,2,5 각각 사원,방문자,블랙리스트 사용자 목록"
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/User"  
 *    /user/{id}:
 *       get:
 *         tags:
 *         - "user"
 *         summary: "사용자 조회"
 *         parameters:
 *          - name: "user _id"
 *            in: "path"
 *            description: "사용자의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee9db4360497f4ee3dd0f4f'
 *            value: '5ee9db4360497f4ee3dd0f4f'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/User" 
 *       put:
 *         tags:
 *         - "user"
 *         summary: "사용자 업데이트"
 *         parameters:
 *          - name: "user _id"
 *            in: "path"
 *            description: "사용자의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee9db4360497f4ee3dd0f4f'
 *            value: '5ee9db4360497f4ee3dd0f4f'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/User" 
 *       delete:
 *         tags:
 *         - "user"
 *         summary: "사용자 삭제"
 *         parameters:
 *          - name: "user _id"
 *            in: "path"
 *            description: "사용자의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee9db4360497f4ee3dd0f4f'
 *            value: '5ee9db4360497f4ee3dd0f4f'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/User"
 * 
 *    /version:
 *       post:
 *          tags:
 *          - "version"
 *          summary: "버전 등록"
 *          parameters:
 *          - in: "body"
 *            name: "body"
 *            description: "버전 등록"
 *            required: true
 *            schema:
 *              $ref: "#/definitions/Version"
 *       get:
 *         tags:
 *         - "version"
 *         summary: "버전 목록 조회" 
 *         responses:
 *          "200":
 *            schema:
 *              type: "array"
 *              items:
 *                $ref: "#/definitions/Version" 
 *    /version/{id}:
 *       get:
 *         tags:
 *         - "version"
 *         summary: "버전 조회"
 *         parameters:
 *          - name: "version _id"
 *            in: "path"
 *            description: "버전의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30969de50a931f80644ed'
 *            value: '5ee30969de50a931f80644ed'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Version" 
 *       put:
 *         tags:
 *         - "version"
 *         summary: "버전 업데이트"
 *         parameters:
 *          - name: "version _id"
 *            in: "path"
 *            description: "버전의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30969de50a931f80644ed'
 *            value: '5ee30969de50a931f80644ed'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Version" 
 *       delete:
 *         tags:
 *         - "version"
 *         summary: "버전 삭제"
 *         parameters:
 *          - name: "version _id"
 *            in: "path"
 *            description: "버전의 mongodb _id"
 *            required: true
 *            type: "string"
 *            format: "string"
 *            example: '5ee30969de50a931f80644ed'
 *            value: '5ee30969de50a931f80644ed'
 *         responses:
 *          "200":
 *            schema:
 *                $ref: "#/definitions/Version"
 */