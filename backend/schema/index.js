// // Import External Dependancies
// const graphql = require('graphql')

// // Destructure GraphQL functions
// const {
// 	GraphQLSchema,
// 	GraphQLObjectType,
// 	GraphQLString,
// 	GraphQLInt,
// 	GraphQLID,
// 	GraphQLList,
// 	GraphQLNonNull
// } = graphql

// const auth = () => {

// }

// // Example 정찬우
// const authorized_accessController = require('../controller/authorized_accessController')
// const userController = require('../controller/userController')
// const all_accessController = require('../controller/all_accessController')

// //Sense Link Basics API 
// const api_v1_server_versionController = require('../controller/api/v1/server/version')

// //Sense Link Device API 
// const api_v3_device_gatewayController = require('../controller/api/v3/device/gateway')
// const api_v3_device_cameraController = require('../controller/api/v3/device/camera')

// //Sense Link Alarms API
// const api_v2_device_alarmController = require('../controller/api/v2/device/alarm')

// //Sense Link Person API
// const api_v1_person_userController = require('../controller/api/v1/person/user')

// const api_v1_person_accessController = require('../controller/api/v1/person/access')

// //Define Object Types Sense Link Basics API
// const api_v1_server_versionType = new GraphQLObjectType({
// 	name: 'api_v1_server_version',
// 	fields: () => ({
// 		_id			: { type: GraphQLID },
// 		app_key		: { type: GraphQLString },
// 		sign		: { type: GraphQLString },
// 		timestamp	: { type: GraphQLString },
// 		edition		: { type: GraphQLString },
// 		date		: { type: GraphQLString }
// 	})
// })

// //Define Object Types Sense Link Device API
// const api_v3_device_gatewayType = new GraphQLObjectType({
// 	name: 'api_v3_device_gateway',
// 	fields: () => ({
// 		_id			: { type: GraphQLID },
// 		app_key		: { type: GraphQLString },
// 		sign		: { type: GraphQLString },
// 		timestamp	: { type: GraphQLString },
// 		identifier	: { type: GraphQLString },
// 		name		: { type: GraphQLString },
// 		location	: { type: GraphQLString },
// 		ip			: { type: GraphQLString },
// 		port		: { type: GraphQLInt },
// 		account		: { type: GraphQLString },
// 		password	: { type: GraphQLString },
// 		id			: { type: GraphQLString },
// 		description	: { type: GraphQLString },
// 		direction	: { type: GraphQLInt },
// 		ldid		: { type: GraphQLString },
// 		type_id		: { type: GraphQLInt },
// 		type_name	: { type: GraphQLString },
// 		updated_at	: { type: GraphQLString },
// 		created_at	: { type: GraphQLString },
// 		camera_data: {
// 			type: api_v3_device_cameraType,
// 			async resolve(parent, args) {
// 				return await api_v3_device_cameraController.getapi_v3_device_camera_depend_on_gateway({ id: parent._id })
// 			}
// 		},
// 	})
// })
// const api_v3_device_cameraType = new GraphQLObjectType({
// 	name: 'api_v3_device_camera',
// 	fields: () => ({
// 		_id					: { type: GraphQLID },
// 		app_key				: { type: GraphQLString },
// 		sign				: { type: GraphQLString },
// 		timestamp			: { type: GraphQLString },
// 		channel				: { type: GraphQLInt },
// 		identifier 			: { type: GraphQLString },
// 		node_type			: { type: GraphQLInt },
// 		gateway_id			: { type: GraphQLID},
// 		protocol			: { type: GraphQLInt },
// 		camera_name			: { type: GraphQLString },
// 		location			: { type: GraphQLString },
// 		snap_mode			: { type: GraphQLInt },
// 		url					: { type: GraphQLString },
// 		ip					: { type: GraphQLString },
// 		port				: { type: GraphQLInt },
// 		account				: { type: GraphQLString },
// 		password			: { type: GraphQLString },
// 		server_id			: { type: GraphQLString },
// 		camera_id			: { type: GraphQLString },
// 		id					: { type: GraphQLString },
// 		name				: { type: GraphQLString },
// 		groups				: { type: GraphQLString },
// 		description			: { type: GraphQLString },
// 		direction			: { type: GraphQLInt },
// 		employee_group		: { type: new GraphQLList(GraphQLString) },
// 		visitor_group		: { type: new GraphQLList(GraphQLString) },
// 		blacklist_group		: { type: new GraphQLList(GraphQLString) },
// 		ldid				: { type: GraphQLString },
// 		type_id				: { type: GraphQLInt },
// 		type_name			: { type: GraphQLString },
// 		updated_at			: { type: GraphQLString },
// 		created_at			: { type: GraphQLString },
// 		last_offline_time	: { type: GraphQLString },
// 		config_data			: { type: new GraphQLList(GraphQLString) },
// 	})
// })

// //Define Object Types Sense Link Alarms API
// const api_v2_device_alarmType = new GraphQLObjectType({
// 	name: 'api_v2_device_alarm',
// 	fields: () => ({
// 		_id					: { type: GraphQLID },
// 		app_key				: { type: GraphQLString },
// 		sign				: { type: GraphQLString },
// 		timestamp			: { type: GraphQLString },
// 		status				: { type: GraphQLInt },
// 		level				: { type: GraphQLInt },
// 		code				: { type: GraphQLInt },
// 		description			: { type: GraphQLString },
// 		alarm_time			: { type: GraphQLString },
// 		alarm_timeL			: { type: GraphQLString },
// 		release_time		: { type: GraphQLString },
// 		alarm_photo			: { type: GraphQLString },
// 		reslove_option		: { type: GraphQLInt },
// 		user_id				: { type: GraphQLID},
// 		user_data: {
// 			type: api_v2_device_alarmType,
// 			async resolve(parent, args) {
// 				return await api_v2_device_alarmController.getapi_v2_device_alarm_depend_on_user({ id: parent.user_id })
// 			}
// 		},
// 		device_id			: { type: GraphQLID},
// 		device_data: {
// 			type: api_v2_device_alarmType,
// 			async resolve(parent, args) {
// 				return await api_v2_device_alarmController.getapi_v2_device_alarm_depend_on_device({ id: parent.device_id })
// 			}
// 		},
// 		trace_id			: { type: GraphQLID},
// 		trace_data: {
// 			type: api_v2_device_alarmType,
// 			async resolve(parent, args) {
// 				return await api_v2_device_alarmController.getapi_v2_device_alarm_depend_on_trace({ id: parent.trace_id })
// 			}
// 		},
// 	})
// })

// //Define Object Types Sense Link Person API
// const api_v1_person_userType = new GraphQLObjectType({
// 	name: 'api_v1_person_user',
// 	fields: () => ({
// 		_id					: { type: GraphQLID },
// 		app_key				: { type: GraphQLString },
// 		sign				: { type: GraphQLString },
// 		timestamp			: { type: GraphQLString },
// 		avatar_file			: { type: GraphQLString },
// 		groups				: { type: new GraphQLList(GraphQLString) },
// 		ic_number			: { type: GraphQLString },
// 		job_number			: { type: GraphQLString },
// 		id_number			: { type: GraphQLString },
// 		id					: { type: GraphQLString },
// 		password			: { type: GraphQLString },
// 		mobile				: { type: GraphQLString },
// 		name				: { type: GraphQLString },
// 		remark				: { type: GraphQLString },
// 		force				: { type: GraphQLInt },
// 		company_id			: { type: GraphQLString },
// 		department_id		: { type: GraphQLString },
// 		area_code			: { type: GraphQLString },
// 		birthday			: { type: GraphQLString },
// 		entry_time			: { type: GraphQLString },
// 		mail				: { type: GraphQLString },
// 		position			: { type: GraphQLString },
// 		location			: { type: GraphQLString },
// 		reception_user_id	: { type: GraphQLID },
// 		reception_user_data	: {
// 			type: api_v1_person_userType,
// 			async resolve(parent, args) {
// 				return await api_v1_person_userController.getapi_v1_person_user_depend_on_user({ id: parent.reception_user_id })
// 			}
// 		},
// 		guest_company		: { type: GraphQLString },
// 		guest_purpose		: { type: GraphQLString },
// 		level				: { type: GraphQLString },
// 		gender				: { type: GraphQLInt },
// 		prompt				: { type: GraphQLString },
// 		type				: { type: GraphQLInt },
// 		last_type			: { type: GraphQLInt },
// 		created_at			: { type: GraphQLString },
// 		updated_at			: { type: GraphQLString },
// 	})
// })

// const api_v1_person_accessType = new GraphQLObjectType({
// 	name: 'api_v1_person_access',
// 	fields: () => ({
// 		_id					: { type: GraphQLID },
// 		type				: { type: GraphQLInt },
// 		last_type				: { type: GraphQLInt },
// 		group_list			: { type: new GraphQLList(GraphQLString) },
// 		name			: { type: GraphQLString },
// 		avatar_file				: { type: GraphQLString },
// 		mobile			: { type: GraphQLString },
// 		ic_number			: { type: GraphQLString },
// 		id_number			: { type: GraphQLString },
// 		job_number					: { type: GraphQLString },
// 		id			: { type: GraphQLString },
// 		birthday				: { type: GraphQLString },
// 		mail				: { type: GraphQLString },
// 		gender				: { type: GraphQLString },
// 		prompt				: { type: GraphQLString },
// 		remark			: { type: GraphQLString },
// 		position		: { type: GraphQLString },
// 		location			: { type: GraphQLString },
// 		company_id			: { type: GraphQLString },
// 		department_id			: { type: GraphQLString },
// 		area_code				: { type: GraphQLString },
// 		entry_time			: { type: GraphQLString },
// 		reception_user_id	: { type: GraphQLID },
// 		reception_user_data	: {
// 			type: api_v1_person_accessType,
// 			async resolve(parent, args) {
// 				return await api_v1_person_accessController.getapi_v1_person_access_depend_on_user({ id: parent.reception_user_id })
// 			}
// 		},
// 		guest_company		: { type: GraphQLString },
// 		guest_purpose		: { type: GraphQLString },
// 		guest_level				: { type: GraphQLString },
// 		created_at			: { type: GraphQLString },
// 		updated_at			: { type: GraphQLString },
// 	})
// })

// // TODO: 제거
// // Define Object Types
// const authorized_accessType = new GraphQLObjectType({
// 	name: 'authorized_access',
// 	fields: () => ({
// 		_id: { type: GraphQLID },
// 		name: { type: GraphQLString },
// 		company: { type: GraphQLString },
// 		data: { type: GraphQLString },
// 		user_fkid: { type: GraphQLID },
// 		user: {
// 			type: userType,
// 			async resolve(parent, args) {
// 				return await userController.getSingleUser({ id: parent.user_fkid })
// 			}
// 		},
// 		all_access: {
// 			type: new GraphQLList(all_accessType),
// 			async resolve(parent, args) {
// 				return await all_accessController.getAuthorized_accesssAll_Access({ id: parent._id })
// 			}
// 		}
// 	})
// })
// // TODO: 제거
// const userType = new GraphQLObjectType({
// 	name: 'user',
// 	fields: () => ({
// 		_id: { type: GraphQLID },
// 		user_id: { type: GraphQLString },
//         user_pw: { type: GraphQLString },
//         user_lang: { type: GraphQLString },
//         user_name: { type: GraphQLString },
// 		authorized_accesss: {
// 			type: new GraphQLList(authorized_accessType),
// 			async resolve(parent, args) {
// 				return await userController.getUsersAuthorized_accesss({ id: parent._id })
// 			}
// 		}
// 	})
// })
// // TODO: 제거
// const all_accessType = new GraphQLObjectType({
// 	name: 'all_access',
// 	fields: () => ({
// 		_id: { type: GraphQLID },
//         authorized_access_fkid: { type: GraphQLID },
//         device_fkid: { type: GraphQLID },
//         safe_status: { type: GraphQLString },
// 		recognized_data: { type: GraphQLString },
//         date: { type: GraphQLString },
//         statistics_process_status: { type: GraphQLString },
// 		authorized_access: {
// 			type: authorized_accessType,
// 			async resolve(parent, args) {
// 				return await authorized_accessController.getSingleauthorized_access({ id: parent.authorized_access_fkid })
// 			}
//         }
// 	})
// })

// // Define Root Query
// const RootQuery = new GraphQLObjectType({
// 	name: 'RootQueryType',
// 	fields: {
// 		//Sense Link Basics API
// 		api_v1_server_version: {
// 			type: api_v1_server_versionType,
// 			args: { id: { type: GraphQLID } },
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v1_server_versionController.getSingleapi_v1_server_version(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		api_v1_server_versions: {
// 			type: new GraphQLList(api_v1_server_versionType),
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v1_server_versionController.getapi_v1_server_versions()
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},

// 		//Sense Link Devices API
// 		api_v3_device_gateway: {
// 			type: api_v3_device_gatewayType,
// 			args: { id: { type: GraphQLID } },
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v3_device_gatewayController.getSingleapi_v3_device_gateway(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		api_v3_device_gateways: {
// 			type: new GraphQLList(api_v3_device_gatewayType),
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v3_device_gatewayController.getapi_v3_device_gateways()
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},

// 		api_v3_device_camera: {
// 			type: api_v3_device_cameraType,
// 			args: { id: { type: GraphQLID } },
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v3_device_cameraController.getSingleapi_v3_device_camera(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		api_v3_device_cameras: {
// 			type: new GraphQLList(api_v3_device_cameraType),
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v3_device_cameraController.getapi_v3_device_cameras()
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
		
// 		api_v2_device_alarm: {
// 			type: api_v2_device_alarmType,
// 			args: { id: { type: GraphQLID } },
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v2_device_alarmController.getSingleapi_v2_device_alarm(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		api_v2_device_alarms: {
// 			type: new GraphQLList(api_v2_device_alarmType),
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v2_device_alarmController.getapi_v2_device_alarms()
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},

// 		//Sense Link Person API
// 		api_v1_person_user: {
// 			type: api_v1_person_userType,
// 			args: { id: { type: GraphQLID } },
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v1_person_userController.getSingleapi_v1_person_user(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		api_v1_person_users: {
// 			type: new GraphQLList(api_v1_person_userType),
// 			args: { type: { type: GraphQLInt } },
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v1_person_userController.getapi_v1_person_users(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		api_v1_person_every_type_users: {
// 			type: new GraphQLList(api_v1_person_userType),
// 			args: { type: { type: GraphQLInt } },
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v1_person_userController.getapi_v1_person_every_type_users(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		api_v1_person_access : {
// 			type : api_v1_person_accessType,
// 			args : { id: { type: GraphQLID } },
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v1_person_accessController.getSingleapi_v1_person_access(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		api_v1_person_accesss : {
// 			type: new GraphQLList(api_v1_person_accessType),
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await api_v1_person_accessController.getapi_v1_person_access()
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},


// 		// TODO: 제거
// 		authorized_access: {
// 			type: authorized_accessType,
// 			args: { id: { type: GraphQLID } },
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await authorized_accessController.getSingleAuthorized_access(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		// TODO: 제거
// 		authorized_accesss: {
// 			type: new GraphQLList(authorized_accessType),
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await authorized_accessController.getAuthorized_accesss()
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		// TODO: 제거
// 		user: {
// 			type: userType,
// 			args: { 
// 				user_id: { type: GraphQLString},
// 				user_pw: { type: GraphQLString},
// 			},
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await userController.getSingleUser(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		login : {
// 			type: userType,
// 			args: { 
// 				user_id: { type: GraphQLString},
// 				user_pw: { type: GraphQLString},
// 			},
// 			async resolve(parent, args, context) {
// 				return await userController.login(args)
// 			}
// 		},
// 		users : {
// 			type : new GraphQLList(userType),
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await userController.getUsers()
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		// TODO: 제거
// 		all_access: {
// 			type: all_accessType,
// 			args: { id: { type: GraphQLID } },
// 			async resolve(parent, args, context) {
// 				if(context.auth === true) {	
// 					return await all_accessController.getSingleAll_Access(args)
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		}
// 	}
// })

// // Define Mutations
// const Mutations = new GraphQLObjectType({
// 	name: 'Mutations',
// 	fields: {
// 		// TODO: 제거
// 		addauthorized_access: {
// 			type: authorized_accessType,
// 			args: {
// 				name: { type: new GraphQLNonNull(GraphQLString) },
//                 company: { type: new GraphQLNonNull(GraphQLString) },
//                 data: { type: new GraphQLNonNull(GraphQLString) },
// 				user_fkid: { type: GraphQLID }
// 			},
// 			async resolve(parent, args,context) {

// 				if(context.auth === true) {	
// 					const data = await authorized_accessController.addAuthorized_access(args)
// 					return data
// 			} else {
// 				throw '유효 하지 않는 토큰 입니다';
// 			}
// 			}
// 		},
// 		addUser : {
// 			type : userType,
// 			args: {
// 				user_id: { type:  new GraphQLNonNull(GraphQLString) },
// 				user_pw: { type:  new GraphQLNonNull(GraphQLString) },
// 				user_lang: { type:  new GraphQLNonNull(GraphQLString) },
// 				user_name: { type:  new GraphQLNonNull(GraphQLString) },
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await userController.addUser(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		// TODO: 제거
// 		editauthorized_access: {
// 			type: authorized_accessType,
// 			args: {
// 				id: { type: new GraphQLNonNull(GraphQLID) },
// 				name: { type: new GraphQLNonNull(GraphQLString) },
//                 company: { type: new GraphQLNonNull(GraphQLString) },
//                 data: { type: new GraphQLNonNull(GraphQLString) },
// 				user_fkid: { type: GraphQLID }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await authorized_accessController.updateAuthorized_access(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		// TODO: 제거
// 		deleteauthorized_access: {
// 			type: authorized_accessType,
// 			args: {
// 				id: 		{ type: new GraphQLNonNull(GraphQLID) }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await authorized_accessController.deleteAuthorized_access(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},

// 		//Sense Link Basic API
// 		addapi_v1_server_version: {
// 			type: api_v1_server_versionType,
// 			args: {
// 				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
//                 sign: 		{ type: new GraphQLNonNull(GraphQLString) },
//                 timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				edition: 	{ type: GraphQLString },
// 				date: 		{ type: GraphQLString }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v1_server_versionController.addapi_v1_server_version(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		editapi_v1_server_version: {
// 			type: api_v1_server_versionType,
// 			args: {
// 				id: 		{ type: new GraphQLNonNull(GraphQLID) },
// 				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
//                 sign: 		{ type: new GraphQLNonNull(GraphQLString) },
//                 timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				edition: 	{ type: GraphQLString },
// 				date: 		{ type: GraphQLString }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v1_server_versionController.updateapi_v1_server_version(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		deleteapi_v1_server_version: {
// 			type: api_v1_server_versionType,
// 			args: {
// 				id: 		{ type: new GraphQLNonNull(GraphQLID) }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v1_server_versionController.deleteapi_v1_server_version(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},

// 		//Sense Link Device API
// 		//gateway API
// 		addapi_v3_device_gateway: {
// 			type: api_v3_device_gatewayType,
// 			args: {
// 				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
//                 sign: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				identifier: { type: new GraphQLNonNull(GraphQLString) },
// 				name: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				location: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				ip: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				port: 		{ type: new GraphQLNonNull(GraphQLInt) },
// 				account: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				password: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				id: 		{ type: GraphQLString },
// 				description:{ type: GraphQLString },
// 				direction: 	{ type: GraphQLInt },
// 				ldid: 		{ type: GraphQLString },
// 				type_id: 	{ type: GraphQLInt },
// 				type_name: 	{ type: GraphQLString },
// 				updated_at: 	{ type: GraphQLString },
// 				created_at: 	{ type: GraphQLString }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v3_device_gatewayController.addapi_v3_device_gateway(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		editapi_v3_device_gateway: {
// 			type: api_v3_device_gatewayType,
// 			args: {
// 				id: 		{ type: new GraphQLNonNull(GraphQLID) },
// 				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
//                 sign: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				identifier: { type: new GraphQLNonNull(GraphQLString) },
// 				name: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				location: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				ip: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				port: 		{ type: new GraphQLNonNull(GraphQLInt) },
// 				account: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				password: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				id: 		{ type: GraphQLString },
// 				description:{ type: GraphQLString },
// 				direction: 	{ type: GraphQLInt },
// 				ldid: 		{ type: GraphQLString },
// 				type_id: 	{ type: GraphQLInt },
// 				type_name: 	{ type: GraphQLString },
// 				updated_at: 	{ type: GraphQLString },
// 				created_at: 	{ type: GraphQLString }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v3_device_gatewayController.updateapi_v3_device_gateway(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		deleteapi_v3_device_gateway: {
// 			type: api_v3_device_gatewayType,
// 			args: {
// 				id: 		{ type: new GraphQLNonNull(GraphQLID) }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v3_device_gatewayController.deleteapi_v3_device_gateway(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},

// 		//camera API
// 		addapi_v3_device_camera: {
// 			type: api_v3_device_cameraType,
// 			args: {
// 				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
//                 sign: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				channel:	{ type: new GraphQLNonNull(GraphQLInt) },
// 				identifier: { type: new GraphQLNonNull(GraphQLString) },
// 				node_type: 	{ type: new GraphQLNonNull(GraphQLInt) },
// 				gateway_id:	{ type: new GraphQLNonNull(GraphQLID)},
// 				protocol:	{ type: new GraphQLNonNull(GraphQLInt) },
// 				camera_name:{ type: new GraphQLNonNull(GraphQLString) },
// 				location: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				snap_mode: 	{ type: new GraphQLNonNull(GraphQLInt) },
// 				status: 	{ type: GraphQLString },
// 				software_version: { type: GraphQLString },
// 				url: 		{ type: GraphQLString },
// 				ip: 		{ type: GraphQLString },
// 				port: 		{ type: GraphQLInt },
// 				account:	{ type: GraphQLString },
// 				password:	{ type: GraphQLString },
// 				server_id:	{ type: GraphQLString },
// 				camera_id:	{ type: GraphQLString },
// 				id:			{ type: GraphQLString },
// 				name:		{ type: GraphQLString },
// 				description:{ type: GraphQLString },
// 				direction: 	{ type: GraphQLInt },
// 				groups: 	{ type: new GraphQLList(GraphQLString) },
// 				group_count:{ type: GraphQLInt },
// 				employee_group	: { type: new GraphQLList(GraphQLString) },
// 				visitor_group	: { type: new GraphQLList(GraphQLString) },
// 				blacklist_group	: { type: new GraphQLList(GraphQLString) },
// 				ldid: 		{ type: GraphQLString },
// 				type_id: 	{ type: GraphQLInt },
// 				type_name: 	{ type: GraphQLString },
// 				updated_at: 	{ type: GraphQLString },
// 				created_at: 	{ type: GraphQLString },
// 				last_offline_time : { type: GraphQLString },
// 				config_data:{ type: new GraphQLList(GraphQLString) }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v3_device_cameraController.addapi_v3_device_camera(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		editapi_v3_device_camera: {
// 			type: api_v3_device_cameraType,
// 			args: {
// 				id: 		{ type: new GraphQLNonNull(GraphQLID) },
// 				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
//                 sign: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				channel:	{ type: new GraphQLNonNull(GraphQLInt) },
// 				identifier: { type: new GraphQLNonNull(GraphQLString) },
// 				node_type: 	{ type: new GraphQLNonNull(GraphQLInt) },
// 				gateway_id:	{ type: new GraphQLNonNull(GraphQLID)},
// 				protocol:	{ type: new GraphQLNonNull(GraphQLInt) },
// 				camera_name:{ type: new GraphQLNonNull(GraphQLString) },
// 				location: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				snap_mode: 	{ type: new GraphQLNonNull(GraphQLInt) },
// 				status: 	{ type: GraphQLString },
// 				software_version: { type: GraphQLString },
// 				url: 		{ type: GraphQLString },
// 				ip: 		{ type: GraphQLString },
// 				port: 		{ type: GraphQLInt },
// 				account:	{ type: GraphQLString },
// 				password:	{ type: GraphQLString },
// 				server_id:	{ type: GraphQLString },
// 				camera_id:	{ type: GraphQLString },
// 				id:			{ type: GraphQLString },
// 				name:		{ type: GraphQLString },
// 				description:{ type: GraphQLString },
// 				direction: 	{ type: GraphQLInt },
// 				groups: 	{ type: new GraphQLList(GraphQLString) },
// 				group_count:{ type: GraphQLInt },
// 				employee_group	: { type: new GraphQLList(GraphQLString) },
// 				visitor_group	: { type: new GraphQLList(GraphQLString) },
// 				blacklist_group	: { type: new GraphQLList(GraphQLString) },
// 				ldid: 		{ type: GraphQLString },
// 				type_id: 	{ type: GraphQLInt },
// 				type_name: 	{ type: GraphQLString },
// 				updated_at: 	{ type: GraphQLString },
// 				created_at: 	{ type: GraphQLString },
// 				last_offline_time : { type: GraphQLString },
// 				config_data:{ type: new GraphQLList(GraphQLString) }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v3_device_cameraController.updateapi_v3_device_camera(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		deleteapi_v3_device_camera: {
// 			type: api_v3_device_cameraType,
// 			args: {
// 				id: 		{ type: new GraphQLNonNull(GraphQLID) }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v3_device_cameraController.deleteapi_v3_device_camera(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},

// 		//ALARM API
// 		addapi_v2_device_alarm: {
// 			type: api_v2_device_alarmType,
// 			args: {
// 				app_key: 		{ type: new GraphQLNonNull(GraphQLString) },
//                 sign: 			{ type: new GraphQLNonNull(GraphQLString) },
// 				timestamp: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				status:			{ type: GraphQLInt },
// 				level: 			{ type: GraphQLInt },
// 				code:			{ type: GraphQLInt },
// 				description: 	{ type: GraphQLString },
// 				alarm_time: 	{ type: GraphQLString },
// 				alarm_timeL: 	{ type: GraphQLString },
// 				release_time: 	{ type: GraphQLString },
// 				alarm_photo: 	{ type: GraphQLString },
// 				reslove_option: { type: GraphQLInt },
// 				user_id:		{ type: GraphQLID },
// 				device_id:		{ type: GraphQLID },
// 				trace_id:		{ type: GraphQLID }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v2_device_alarmController.addapi_v2_device_alarm(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		editapi_v2_device_alarm: {
// 			type: api_v2_device_alarmType,
// 			args: {
// 				id: 			{ type: new GraphQLNonNull(GraphQLID) },
// 				app_key: 		{ type: new GraphQLNonNull(GraphQLString) },
//                 sign: 			{ type: new GraphQLNonNull(GraphQLString) },
// 				timestamp: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				status:			{ type: GraphQLInt },
// 				level: 			{ type: GraphQLInt },
// 				code:			{ type: GraphQLInt },
// 				description: 	{ type: GraphQLString },
// 				alarm_time: 	{ type: GraphQLString },
// 				alarm_timeL: 	{ type: GraphQLString },
// 				release_time: 	{ type: GraphQLString },
// 				alarm_photo: 	{ type: GraphQLString },
// 				reslove_option: { type: GraphQLInt },
// 				user_id:		{ type: GraphQLID },
// 				device_id:		{ type: GraphQLID },
// 				trace_id:		{ type: GraphQLID }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v2_device_alarmController.updateapi_v2_device_alarm(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		deleteapi_v2_device_alarm: {
// 			type: api_v2_device_alarmType,
// 			args: {
// 				id: 			{ type: new GraphQLNonNull(GraphQLID) }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v2_device_alarmController.deleteapi_v2_device_alarm(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},

// 		//Person API
// 		addapi_v1_person_user: {
// 			type: api_v1_person_userType,
// 			args: {
// 				app_key: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				sign: 			{ type: new GraphQLNonNull(GraphQLString) },
// 				timestamp: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				avatar_file: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				groups: 		{ type: new GraphQLList(GraphQLString) },
// 				ic_number: 		{ type: GraphQLString },
// 				job_number: 	{ type: GraphQLString },
// 				id_number: 		{ type: GraphQLString },
// 				id:				{ type: GraphQLString },
// 				password:		{ type: GraphQLString },
// 				mobile: 		{ type: GraphQLString },
// 				name: 			{ type: GraphQLString },
// 				remark: 		{ type: GraphQLString },
// 				force: 			{ type: GraphQLInt },
// 				company_id: 	{ type: GraphQLString },
// 				department_id: 	{ type: GraphQLString },
// 				area_code: 		{ type: GraphQLString },
// 				birthday: 		{ type: GraphQLString },
// 				entry_time: 	{ type: GraphQLString },
// 				mail: 			{ type: GraphQLString },
// 				position: 		{ type: GraphQLString },
// 				location: 		{ type: GraphQLString },
// 				reception_user_id: { type: GraphQLID },
// 				guest_company: 	{ type: GraphQLString },
// 				guest_purpose: 	{ type: GraphQLString },
// 				level: 			{ type: GraphQLString },
// 				gender: 		{ type: GraphQLInt },
// 				prompt: 		{ type: GraphQLString },
// 				type: 			{ type: GraphQLInt },
// 				last_type: 		{ type: GraphQLInt },
// 				created_at: 	{ type: GraphQLString },
// 				updated_at: 	{ type: GraphQLString }
// 			},
// 			async resolve(parent, args,context) {
// 				//TODO: 인증절차
// 				if(context.auth === true) {	
// 					const data = await api_v1_person_userController.addapi_v1_person_user(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		editapi_v1_person_user: {
// 			type: api_v1_person_userType,
// 			args: {
// 				_id: 			{ type: new GraphQLNonNull(GraphQLID) },
// 				app_key: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				sign: 			{ type: new GraphQLNonNull(GraphQLString) },
// 				timestamp: 		{ type: new GraphQLNonNull(GraphQLString) },
// 				avatar_file: 	{ type: new GraphQLNonNull(GraphQLString) },
// 				groups: 		{ type: new GraphQLList(GraphQLString) },
// 				ic_number: 		{ type: GraphQLString },
// 				job_number: 	{ type: GraphQLString },
// 				id_number: 		{ type: GraphQLString },
// 				id:				{ type: GraphQLString },
// 				password:		{ type: GraphQLString },
// 				mobile: 		{ type: GraphQLString },
// 				name: 			{ type: GraphQLString },
// 				remark: 		{ type: GraphQLString },
// 				force: 			{ type: GraphQLInt },
// 				company_id: 	{ type: GraphQLString },
// 				department_id: 	{ type: GraphQLString },
// 				area_code: 		{ type: GraphQLString },
// 				birthday: 		{ type: GraphQLString },
// 				entry_time: 	{ type: GraphQLString },
// 				mail: 			{ type: GraphQLString },
// 				position: 		{ type: GraphQLString },
// 				location: 		{ type: GraphQLString },
// 				reception_user_id: { type: GraphQLID },
// 				guest_company: 	{ type: GraphQLString },
// 				guest_purpose: 	{ type: GraphQLString },
// 				level: 			{ type: GraphQLString },
// 				gender: 		{ type: GraphQLInt },
// 				prompt: 		{ type: GraphQLString },
// 				type: 			{ type: GraphQLInt },
// 				last_type: 		{ type: GraphQLInt },
// 				created_at: 	{ type: GraphQLString },
// 				updated_at: 	{ type: GraphQLString }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v1_person_userController.updateapi_v1_person_user(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		deleteapi_v1_person_user: {
// 			type: api_v1_person_userType,
// 			args: {
// 				id: 			{ type: new GraphQLNonNull(GraphQLID) }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v1_person_userController.deleteapi_v1_person_user(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},

// 		addapi_v1_person_access: {
// 			type: api_v1_person_accessType,
// 			args: {
// 				type				: { type: GraphQLInt },
// 				last_type			: { type: GraphQLInt },
// 				group_list			: { type: new GraphQLList(GraphQLString) },
// 				name				: { type: GraphQLString },
// 				avatar_file			: { type: GraphQLString },
// 				mobile				: { type: GraphQLString },
// 				ic_number			: { type: GraphQLString },
// 				id_number			: { type: GraphQLString },
// 				job_number			: { type: GraphQLString },
// 				id					: { type: GraphQLString },
// 				birthday			: { type: GraphQLString },
// 				mail				: { type: GraphQLString },
// 				gender				: { type: GraphQLString },
// 				prompt				: { type: GraphQLString },
// 				remark				: { type: GraphQLString },
// 				position			: { type: GraphQLString },
// 				location			: { type: GraphQLString },
// 				company_id			: { type: GraphQLString },
// 				department_id		: { type: GraphQLString },
// 				area_code			: { type: GraphQLString },
// 				entry_time			: { type: GraphQLString },
// 				reception_user_id	: { type: GraphQLID },
// 				guest_company		: { type: GraphQLString },
// 				guest_purpose		: { type: GraphQLString },
// 				guest_level			: { type: GraphQLString },
// 				created_at			: { type: GraphQLString },
// 				updated_at			: { type: GraphQLString },
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v1_person_accessController.addapi_v1_person_access(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		editapi_v1_person_access: {
// 			type: api_v1_person_accessType,
// 			args: {
// 				_id: 			{ type: new GraphQLNonNull(GraphQLID) },
// 				type				: { type: GraphQLInt },
// 				last_type			: { type: GraphQLInt },
// 				group_list			: { type: new GraphQLList(GraphQLString) },
// 				name				: { type: GraphQLString },
// 				avatar_file			: { type: GraphQLString },
// 				mobile				: { type: GraphQLString },
// 				ic_number			: { type: GraphQLString },
// 				id_number			: { type: GraphQLString },
// 				job_number			: { type: GraphQLString },
// 				id					: { type: GraphQLString },
// 				birthday			: { type: GraphQLString },
// 				mail				: { type: GraphQLString },
// 				gender				: { type: GraphQLString },
// 				prompt				: { type: GraphQLString },
// 				remark				: { type: GraphQLString },
// 				position			: { type: GraphQLString },
// 				location			: { type: GraphQLString },
// 				company_id			: { type: GraphQLString },
// 				department_id		: { type: GraphQLString },
// 				area_code			: { type: GraphQLString },
// 				entry_time			: { type: GraphQLString },
// 				reception_user_id	: { type: GraphQLID },
// 				guest_company		: { type: GraphQLString },
// 				guest_purpose		: { type: GraphQLString },
// 				guest_level			: { type: GraphQLString },
// 				created_at			: { type: GraphQLString },
// 				updated_at			: { type: GraphQLString },
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v1_person_accessController.updateapi_v1_person_access(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 		deleteapi_v1_person_access: {
// 			type: api_v1_person_accessType,
// 			args: {
// 				id: 			{ type: new GraphQLNonNull(GraphQLID) }
// 			},
// 			async resolve(parent, args,context) {
// 				if(context.auth === true) {	
// 					const data = await api_v1_person_accessController.deleteapi_v1_person_access(args)
// 					return data
// 				} else {
// 					throw '유효 하지 않는 토큰 입니다';
// 				}
// 			}
// 		},
// 	}
// })

// // Export the schema
// module.exports = new GraphQLSchema({
// 	query: RootQuery,
// 	mutation: Mutations
// })
