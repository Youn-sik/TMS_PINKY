module.exports = {
  swaggerDefinition: {
    // 정보
    info: {
      title: '출입 통제 시스템',
      version: '1.0.0',
      description: '출입 통제 시스템의 REST API입니다'
    },
    // 주소
    host: "172.16.138.89:3000",
    // 기본 root path
    basePath: "/",
    contact: {
      email: "jjh@koolsign.net"
    },
    // 각 api에서 설명을 기록할 때 사용할 constant들을 미리 등록해놓는것
    components: {
      res: {
        BadRequest: {
          description: '잘못된 요청.',
          schema: {
            $ref: '#/components/errorResult/Error'
          }
        },
        Forbidden: {
          description: '권한이 없슴.',
          schema: {
            $ref: '#/components/errorResult/Error'
          }
        },
        NotFound: {
          description: '없는 리소스 요청.',
          schema: {
            $ref: '#/components/errorResult/Error'
          }
        }
      },
      errorResult: {
        Error: {
          type: 'object',
          properties: {
            errMsg: {
              type: 'string',
              description: '에러 메시지 전달.'
            }
          }
        }
      }
    },
    schemes: ["http"], // 가능한 통신 방식
    definitions:
    {
      'Camera': {
        type: 'object',
        properties: {
          serial_number : { type: 'string'},
          name : { type: 'string'},
          location : { type: 'string'},
          status : { type: 'string' },
          ip : { type: 'string' },
          port : { type: 'integer' },
          description : { type: 'string' },
          groups_obids : {type:'string'},
          info_update_time : { type: 'string' },
          create_at : { type: 'string'},
          create_ut : { type: 'string'},
          update_at : { type: 'string' },
          update_ut : { type: 'string' },
          config_data : {
            type: 'object',
            properties: {
              device_run_type : { type: 'integer' },
              capture_status : { type: 'string' },
              capture_time : { type: 'string' },
              capture_size : { type: 'string' },
              hdd_total : { type: 'integer' },
              hdd_used : { type: 'integer' },
              mac_address : { type: 'string' },
              voice_broadcast : { type: 'boolean' },
              fill_light : { type: 'boolean' },
              welcome_tip : { type: 'string' },
              verify_success_tip : { type: 'string' },
              verify_fault_tip : { type: 'string' },
              show_user_info : { type: 'string' },
              use_show_avatar : { type: 'boolean' },
              show_user_name : { type: 'boolean' },
              black_list_tip : { type: 'string' },
              recognition_distance : { type: 'integer' },
              network_relay_address : { type: 'string' },
              language_type : { type: 'integer' },
              auto_reboot : { type: 'boolean' },
              reboot_time : { type: 'string' },
            }
          }

        }
      },
      'Glogs': {
        type: 'object',
        properties: {
          process_status: { type: 'string'},
          stb_id: { type: 'string' },
          stb_sn: { type: 'string' },
          log_no: { type: 'integer' },
          log_message: { type: 'string' },
          create_dt: { type: 'string' },
          regdate: { type: 'string'}
        }
      },
      'Gateway': {
        type: 'object',
        properties: {
          name : { type: 'string'},
          location : { type: 'string'},
          ip : { type: 'string'},
          port : { type: 'integer'},
          user_obids: {type:'string'},
          camera_obids: {type:'string',},
          description : { type: 'string' },
          create_at : { type: 'string'},
          create_ut : { type: 'string'},
          update_at : { type: 'string' },
          update_ut : { type: 'string' },
        }
      },
      'Group': {
        type: 'object',
        properties: {
          rootParent : { type: 'string' },
          parent : { type: 'string' },
          children : [{ type : 'string' }] ,
          name : { type: 'string'},
          type : { type: 'integer'},
          company_id : { type: 'string' },
          user_obids : {type:'string'},
          device_obids :{type:'string'},
          create_at : { type: 'string'},
          create_ut : { type: 'string'},
          update_at : { type: 'string' },
          update_ut : { type: 'string' },
        }
      },
      'History': {
        type: 'object',
        properties: {
          avatar_file : { type: 'string'},
          avatar_contraction_data : { type: 'string'},
          avatar_file_checksum : { type: 'string'},
          avatar_file_url : { type: 'string'},
          name : { type: 'string' },
          action : { type: 'string'},
          type : { type : 'integer' },
          create_at : { type: 'string'},
          create_ut : { type: 'string'},
        }
      },
      'Operation': {
        type: 'object',
        properties: {
          id : { type: 'string'},
          action : { type: 'string',},
          date : { type: 'string' },
          description : { type: 'string'},
        }
      },
      'Statistics': {
        type: 'object',
        properties: {
          camera_obid : { type : 'string'},
          all_count : { type: 'integer'},
          employee_count : { type: 'integer'},
          guest_count : { type: 'integer'},
          stranger_count : { type: 'integer'},
          blacklist_count : { type: 'integer'},
          statistics_obids : {type:'string'},
          reference_date : { type: 'string' },
        }
      },
      'User': {
        type: 'object',
        properties: {
          avatar_file_url : { type: 'string' },
          groups_obids : {type:'string'},
          user_id : { type: 'string' },
          position : { type: 'string'},
          password : { type: 'string' },
          mobile : { type: 'string' },
          name : { type: 'string' },
          company_id : { type: 'string' },
          department_id : { type: 'string' },
          area_code : { type: 'string' },
          access_time : { type: 'string' },
          mail : { type: 'string' },
          location : { type: 'string' },
          reception_user_obid : { type:'string'},
          guest_company : { type: 'string' },
          guest_purpose : { type: 'string' },
          count : { type : 'integer'},
          gender : { type : 'integer' },
          prompt : { type: 'string' },
          type : { type : 'integer' },
          create_at : { type: 'string'},
          create_ut : { type: 'string'},
          update_at : { type: 'string' },
          update_ut : { type: 'string' },
        }
      },
      'Version': {
        type: 'object',
        properties: {
          user_obid : { type:'string'},
          edition : { type: 'string' },
          create_at : { type: 'string'},
          create_ut : { type: 'string'},
          update_at : { type: 'string' },
          update_ut : { type: 'string' }
        }
      },
      'Camera_monitor': {
        type: 'object',
        properties: {
          camera_obids : { type:'string' },
          serial_number : { type: 'string' },
          name : { type: 'string' },
          location : { type: 'string' },
          sha1_value : { type: 'string' },
          upload_url : { type: 'string' },
          width : { type: 'string' },
          height : { type: 'string' },
          filesize : { type: 'integer' },
          filename : { type: 'string' },
          create_dt: { type: 'string' },
          regdate: { type: 'string'},
        }
      }
    }
  },
  apis: ['/var/www/backend/routes/swagger_apis.js'] // api 파일 위치들 
};