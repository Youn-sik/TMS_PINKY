// Import External Dependancies
const graphql = require('graphql')

// Destructure GraphQL functions
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} = graphql

// Example 정찬우
const authorized_accessController = require('../controller/authorized_accessController')
const userController = require('../controller/userController')
const all_accessController = require('../controller/all_accessController')

//Sense Link Basics API 
const api_v1_server_versionController = require('../controller/api/v1/server/version')

//Sense Link Device API 
const api_v3_device_gatewayController = require('../controller/api/v3/device/gateway')
const api_v3_device_cameraController = require('../controller/api/v3/device/camera')

//Sense Link Alarms API
const api_v2_device_alarmController = require('../controller/api/v2/device/alarm')

//Sense Link Person API
const api_v1_person_userController = require('../controller/api/v1/person/user')

//Define Object Types Sense Link Basics API
const api_v1_server_versionType = new GraphQLObjectType({
	name: 'api_v1_server_version',
	fields: () => ({
		_id			: { type: GraphQLID },
		app_key		: { type: GraphQLString },
		sign		: { type: GraphQLString },
		timestamp	: { type: GraphQLString },
		edition		: { type: GraphQLString },
		date		: { type: GraphQLString }
	})
})

//Define Object Types Sense Link Device API
const api_v3_device_gatewayType = new GraphQLObjectType({
	name: 'api_v3_device_gateway',
	fields: () => ({
		_id			: { type: GraphQLID },
		app_key		: { type: GraphQLString },
		sign		: { type: GraphQLString },
		timestamp	: { type: GraphQLString },
		identifier	: { type: GraphQLString },
		name		: { type: GraphQLString },
		location	: { type: GraphQLString },
		ip			: { type: GraphQLString },
		port		: { type: GraphQLInt },
		account		: { type: GraphQLString },
		password	: { type: GraphQLString },
		id			: { type: GraphQLString },
		description	: { type: GraphQLString },
		direction	: { type: GraphQLInt },
		ldid		: { type: GraphQLString },
		type_id		: { type: GraphQLInt },
		type_name	: { type: GraphQLString },
		update_at	: { type: GraphQLString },
		create_at	: { type: GraphQLString },
		camera_data: {
			type: api_v3_device_cameraType,
			async resolve(parent, args) {
				return await api_v3_device_cameraController.getapi_v3_device_camera_depend_on_gateway({ id: parent._id })
			}
		},
	})
})
const api_v3_device_cameraType = new GraphQLObjectType({
	name: 'api_v3_device_camera',
	fields: () => ({
		_id					: { type: GraphQLID },
		app_key				: { type: GraphQLString },
		sign				: { type: GraphQLString },
		timestamp			: { type: GraphQLString },
		channel				: { type: GraphQLInt },
		identifier 			: { type: GraphQLString },
		node_type			: { type: GraphQLInt },
		gateway_id			: { type: GraphQLID},
		protocol			: { type: GraphQLInt },
		camera_name			: { type: GraphQLString },
		location			: { type: GraphQLString },
		snap_mode			: { type: GraphQLInt },
		url					: { type: GraphQLString },
		ip					: { type: GraphQLString },
		port				: { type: GraphQLInt },
		account				: { type: GraphQLString },
		password			: { type: GraphQLString },
		server_id			: { type: GraphQLString },
		camera_id			: { type: GraphQLString },
		id					: { type: GraphQLString },
		name				: { type: GraphQLString },
		description			: { type: GraphQLString },
		direction			: { type: GraphQLInt },
		employee_group		: { type: GraphQLList },
		visitor_group		: { type: GraphQLList },
		blacklist_group		: { type: GraphQLList },
		ldid				: { type: GraphQLString },
		type_id				: { type: GraphQLInt },
		type_name			: { type: GraphQLString },
		update_at			: { type: GraphQLString },
		create_at			: { type: GraphQLString },
		last_offline_time	: { type: GraphQLString },
		config_data			: { type: GraphQLList },
	})
})

//Define Object Types Sense Link Alarms API
const api_v2_device_alarmType = new GraphQLObjectType({
	name: 'api_v2_device_alarm',
	fields: () => ({
		_id					: { type: GraphQLID },
		app_key				: { type: GraphQLString },
		sign				: { type: GraphQLString },
		timestamp			: { type: GraphQLString },
		status				: { type: GraphQLInt },
		level				: { type: GraphQLInt },
		code				: { type: GraphQLInt },
		description			: { type: GraphQLString },
		alarm_time			: { type: GraphQLString },
		alarm_timeL			: { type: GraphQLString },
		release_time		: { type: GraphQLString },
		alarm_photo			: { type: GraphQLString },
		reslove_option		: { type: GraphQLInt },
		user_id				: { type: GraphQLID},
		user_data: {
			type: api_v2_device_alarmType,
			async resolve(parent, args) {
				return await api_v2_device_alarmController.getapi_v2_device_alarm_depend_on_user({ id: parent.user_id })
			}
		},
		device_id			: { type: GraphQLID},
		device_data: {
			type: api_v2_device_alarmType,
			async resolve(parent, args) {
				return await api_v2_device_alarmController.getapi_v2_device_alarm_depend_on_device({ id: parent.device_id })
			}
		},
		trace_id			: { type: GraphQLID},
		trace_data: {
			type: api_v2_device_alarmType,
			async resolve(parent, args) {
				return await api_v2_device_alarmController.getapi_v2_device_alarm_depend_on_trace({ id: parent.trace_id })
			}
		},
	})
})

//Define Object Types Sense Link Person API
const api_v1_person_userType = new GraphQLObjectType({
	name: 'api_v1_person_user',
	fields: () => ({
		_id					: { type: GraphQLID },
		app_key				: { type: GraphQLString },
		sign				: { type: GraphQLString },
		timestamp			: { type: GraphQLString },
		avatar_file			: { type: GraphQLString },
		groups				: { type: GraphQLList },
		ic_number			: { type: GraphQLString },
		job_number			: { type: GraphQLString },
		id_number			: { type: GraphQLString },
		mobile				: { type: GraphQLString },
		name				: { type: GraphQLString },
		remark				: { type: GraphQLString },
		force				: { type: GraphQLInt },
		company_id			: { type: GraphQLString },
		department_id		: { type: GraphQLString },
		area_code			: { type: GraphQLString },
		birthday			: { type: GraphQLString },
		entry_time			: { type: GraphQLString },
		mail				: { type: GraphQLString },
		position			: { type: GraphQLString },
		location			: { type: GraphQLString },
		reception_user_id	: { type: GraphQLID },
		reception_user_data	: {
			type: api_v1_person_userType,
			async resolve(parent, args) {
				return await api_v1_person_userController.getapi_v1_person_user_depend_on_user({ id: parent.reception_user_id })
			}
		},
		guest_company		: { type: GraphQLString },
		guest_purpose		: { type: GraphQLString },
		level				: { type: GraphQLString },
		gender				: { type: GraphQLInt },
		prompt				: { type: GraphQLString },
		type				: { type: GraphQLInt },
		last_type			: { type: GraphQLInt },
		create_at			: { type: GraphQLString },
		update_at			: { type: GraphQLString },
	})
})

//여기부터 짤것 


// TODO: 제거
// Define Object Types
const authorized_accessType = new GraphQLObjectType({
	name: 'authorized_access',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		company: { type: GraphQLString },
		data: { type: GraphQLString },
		user_fkid: { type: GraphQLID },
		user: {
			type: userType,
			async resolve(parent, args) {
				return await userController.getSingleUser({ id: parent.user_fkid })
			}
		},
		all_access: {
			type: new GraphQLList(all_accessType),
			async resolve(parent, args) {
				return await all_accessController.getAuthorized_accesssAll_Access({ id: parent._id })
			}
		}
	})
})
// TODO: 제거
const userType = new GraphQLObjectType({
	name: 'user',
	fields: () => ({
		_id: { type: GraphQLID },
		user_id: { type: GraphQLString },
        user_pw: { type: GraphQLString },
        user_lang: { type: GraphQLString },
        user_name: { type: GraphQLString },
		authorized_accesss: {
			type: new GraphQLList(authorized_accessType),
			async resolve(parent, args) {
				return await userController.getUsersAuthorized_accesss({ id: parent._id })
			}
		}
	})
})
// TODO: 제거
const all_accessType = new GraphQLObjectType({
	name: 'all_access',
	fields: () => ({
		_id: { type: GraphQLID },
        authorized_access_fkid: { type: GraphQLID },
        device_fkid: { type: GraphQLID },
        safe_status: { type: GraphQLString },
		recognized_data: { type: GraphQLString },
        date: { type: GraphQLString },
        statistics_process_status: { type: GraphQLString },
		authorized_access: {
			type: authorized_accessType,
			async resolve(parent, args) {
				return await authorized_accessController.getSingleauthorized_access({ id: parent.authorized_access_fkid })
			}
        }
	})
})

// Define Root Query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		//Sense Link Basics API
		api_v1_server_version: {
			type: api_v1_server_versionType,
			args: { id: { type: GraphQLID } },
			async resolve(parent, args) {
				return await api_v1_server_versionController.getSingleapi_v1_server_version(args)
			}
		},
		api_v1_server_versions: {
			type: new GraphQLList(api_v1_server_versionType),
			async resolve(parent, args) {
				return await api_v1_server_versionController.getapi_v1_server_versions()
			}
		},

		//Sense Link Devices API
		api_v3_device_gateway: {
			type: api_v3_device_gatewayType,
			args: { id: { type: GraphQLID } },
			async resolve(parent, args) {
				return await api_v3_device_gatewayController.getSingleapi_v3_device_gateway(args)
			}
		},
		api_v3_device_gateways: {
			type: new GraphQLList(api_v3_device_gatewayType),
			async resolve(parent, args) {
				return await api_v3_device_gatewayController.getapi_v3_device_gateways()
			}
		},

		api_v3_device_camera: {
			type: api_v3_device_cameraType,
			args: { id: { type: GraphQLID } },
			async resolve(parent, args) {
				return await api_v3_device_cameraController.getSingleapi_v3_device_camera(args)
			}
		},
		api_v3_device_cameras: {
			type: new GraphQLList(api_v3_device_cameraType),
			async resolve(parent, args) {
				return await api_v3_device_cameraController.getapi_v3_device_cameras()
			}
		},
		
		api_v2_device_alarm: {
			type: api_v2_device_alarmType,
			args: { id: { type: GraphQLID } },
			async resolve(parent, args) {
				return await api_v2_device_alarmController.getSingleapi_v2_device_alarm(args)
			}
		},
		api_v2_device_alarms: {
			type: new GraphQLList(api_v2_device_alarmType),
			async resolve(parent, args) {
				return await api_v2_device_alarmController.getapi_v2_device_alarms()
			}
		},

		// TODO: 제거
		authorized_access: {
			type: authorized_accessType,
			args: { id: { type: GraphQLID } },
			async resolve(parent, args) {
				return await authorized_accessController.getSingleAuthorized_access(args)
			}
		},
		// TODO: 제거
		authorized_accesss: {
			type: new GraphQLList(authorized_accessType),
			async resolve(parent, args) {
				return await authorized_accessController.getAuthorized_accesss()
			}
		},
		// TODO: 제거
		user: {
			type: userType,
			args: { id: { type: GraphQLID } },
			async resolve(parent, args) {
				return await userController.getSingleUser(args)
			}
		},
		// TODO: 제거
		all_access: {
			type: all_accessType,
			args: { id: { type: GraphQLID } },
			async resolve(parent, args) {
				return await all_accessController.getSingleAll_Access(args)
			}
		}
	}
})

// Define Mutations
const Mutations = new GraphQLObjectType({
	name: 'Mutations',
	fields: {
		// TODO: 제거
		addauthorized_access: {
			type: authorized_accessType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
                company: { type: new GraphQLNonNull(GraphQLString) },
                data: { type: new GraphQLNonNull(GraphQLString) },
				user_fkid: { type: GraphQLID }
			},
			async resolve(parent, args) {
				const data = await authorized_accessController.addAuthorized_access(args)
				return data
			}
		},
		// TODO: 제거
		editauthorized_access: {
			type: authorized_accessType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: new GraphQLNonNull(GraphQLString) },
                company: { type: new GraphQLNonNull(GraphQLString) },
                data: { type: new GraphQLNonNull(GraphQLString) },
				user_fkid: { type: GraphQLID }
			},
			async resolve(parent, args) {
				const data = await authorized_accessController.updateAuthorized_access(args)
				return data
			}
		},
		// TODO: 제거
		deleteauthorized_access: {
			type: authorized_accessType,
			args: {
				id: 		{ type: new GraphQLNonNull(GraphQLID) }
			},
			async resolve(parent, args) {
				const data = await authorized_accessController.deleteAuthorized_access(args)
				return data
			}
		},

		//Sense Link Basic API
		addapi_v1_server_version: {
			type: api_v1_server_versionType,
			args: {
				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
                sign: 		{ type: new GraphQLNonNull(GraphQLString) },
                timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
				edition: 	{ type: GraphQLString },
				date: 		{ type: GraphQLString }
			},
			async resolve(parent, args) {
				const data = await api_v1_server_versionController.addapi_v1_server_version(args)
				return data
			}
		},
		editapi_v1_server_version: {
			type: api_v1_server_versionType,
			args: {
				id: 		{ type: new GraphQLNonNull(GraphQLID) },
				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
                sign: 		{ type: new GraphQLNonNull(GraphQLString) },
                timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
				edition: 	{ type: GraphQLString },
				date: 		{ type: GraphQLString }
			},
			async resolve(parent, args) {
				const data = await api_v1_server_versionController.updateapi_v1_server_version(args)
				return data
			}
		},
		deleteapi_v1_server_version: {
			type: api_v1_server_versionType,
			args: {
				id: 		{ type: new GraphQLNonNull(GraphQLID) }
			},
			async resolve(parent, args) {
				const data = await api_v1_server_versionController.deleteapi_v1_server_version(args)
				return data
			}
		},

		//Sense Link Device API
		//gateway API
		addapi_v3_device_gateway: {
			type: api_v3_device_gatewayType,
			args: {
				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
                sign: 		{ type: new GraphQLNonNull(GraphQLString) },
				timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
				identifier: { type: new GraphQLNonNull(GraphQLString) },
				name: 		{ type: new GraphQLNonNull(GraphQLString) },
				location: 	{ type: new GraphQLNonNull(GraphQLString) },
				ip: 		{ type: new GraphQLNonNull(GraphQLString) },
				port: 		{ type: new GraphQLNonNull(GraphQLInt) },
				account: 	{ type: new GraphQLNonNull(GraphQLString) },
				password: 	{ type: new GraphQLNonNull(GraphQLString) },
				id: 		{ type: GraphQLString },
				description:{ type: GraphQLString },
				direction: 	{ type: GraphQLInt },
				ldid: 		{ type: GraphQLString },
				type_id: 	{ type: GraphQLInt },
				type_name: 	{ type: GraphQLString },
				update_at: 	{ type: GraphQLString },
				create_at: 	{ type: GraphQLString }
			},
			async resolve(parent, args) {
				const data = await api_v3_device_gatewayController.addapi_v3_device_gateway(args)
				return data
			}
		},
		editapi_v3_device_gateway: {
			type: api_v3_device_gatewayType,
			args: {
				id: 		{ type: new GraphQLNonNull(GraphQLID) },
				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
                sign: 		{ type: new GraphQLNonNull(GraphQLString) },
				timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
				identifier: { type: new GraphQLNonNull(GraphQLString) },
				name: 		{ type: new GraphQLNonNull(GraphQLString) },
				location: 	{ type: new GraphQLNonNull(GraphQLString) },
				ip: 		{ type: new GraphQLNonNull(GraphQLString) },
				port: 		{ type: new GraphQLNonNull(GraphQLInt) },
				account: 	{ type: new GraphQLNonNull(GraphQLString) },
				password: 	{ type: new GraphQLNonNull(GraphQLString) },
				id: 		{ type: GraphQLString },
				description:{ type: GraphQLString },
				direction: 	{ type: GraphQLInt },
				ldid: 		{ type: GraphQLString },
				type_id: 	{ type: GraphQLInt },
				type_name: 	{ type: GraphQLString },
				update_at: 	{ type: GraphQLString },
				create_at: 	{ type: GraphQLString }
			},
			async resolve(parent, args) {
				const data = await api_v3_device_gatewayController.updateapi_v3_device_gateway(args)
				return data
			}
		},
		deleteapi_v3_device_gateway: {
			type: api_v3_device_gatewayType,
			args: {
				id: 		{ type: new GraphQLNonNull(GraphQLID) }
			},
			async resolve(parent, args) {
				const data = await api_v3_device_gatewayController.deleteapi_v3_device_gateway(args)
				return data
			}
		},

		//camera API
		addapi_v3_device_camera: {
			type: api_v3_device_cameraType,
			args: {
				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
                sign: 		{ type: new GraphQLNonNull(GraphQLString) },
				timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
				channel:	{ type: new GraphQLNonNull(GraphQLInt) },
				identifier: { type: new GraphQLNonNull(GraphQLString) },
				node_type: 	{ type: new GraphQLNonNull(GraphQLInt) },
				gateway_id:	{ type: new GraphQLNonNull(GraphQLID)},
				protocol:	{ type: new GraphQLNonNull(GraphQLInt) },
				camera_name:{ type: new GraphQLNonNull(GraphQLString) },
				location: 	{ type: new GraphQLNonNull(GraphQLString) },
				snap_mode: 	{ type: new GraphQLNonNull(GraphQLInt) },
				status: 	{ type: GraphQLString },
				software_version: { type: GraphQLString },
				url: 		{ type: GraphQLString },
				ip: 		{ type: GraphQLString },
				port: 		{ type: GraphQLInt },
				account:	{ type: GraphQLString },
				password:	{ type: GraphQLString },
				server_id:	{ type: GraphQLString },
				camera_id:	{ type: GraphQLString },
				id:			{ type: GraphQLString },
				name:		{ type: GraphQLString },
				description:{ type: GraphQLString },
				direction: 	{ type: GraphQLInt },
				groups: 	{ type: GraphQLList },
				group_count:{ type: GraphQLInt },
				employee_group	: { type: GraphQLList },
				visitor_group	: { type: GraphQLList },
				blacklist_group	: { type: GraphQLList },
				ldid: 		{ type: GraphQLString },
				type_id: 	{ type: GraphQLInt },
				type_name: 	{ type: GraphQLString },
				update_at: 	{ type: GraphQLString },
				create_at: 	{ type: GraphQLString },
				last_offline_time : { type: GraphQLString },
				config_data:{ type: GraphQLList }
			},
			async resolve(parent, args) {
				const data = await api_v3_device_cameraController.addapi_v3_device_camera(args)
				return data
			}
		},
		editapi_v3_device_camera: {
			type: api_v3_device_cameraType,
			args: {
				id: 		{ type: new GraphQLNonNull(GraphQLID) },
				app_key: 	{ type: new GraphQLNonNull(GraphQLString) },
                sign: 		{ type: new GraphQLNonNull(GraphQLString) },
				timestamp: 	{ type: new GraphQLNonNull(GraphQLString) },
				channel:	{ type: new GraphQLNonNull(GraphQLInt) },
				identifier: { type: new GraphQLNonNull(GraphQLString) },
				node_type: 	{ type: new GraphQLNonNull(GraphQLInt) },
				gateway_id:	{ type: new GraphQLNonNull(GraphQLID)},
				protocol:	{ type: new GraphQLNonNull(GraphQLInt) },
				camera_name:{ type: new GraphQLNonNull(GraphQLString) },
				location: 	{ type: new GraphQLNonNull(GraphQLString) },
				snap_mode: 	{ type: new GraphQLNonNull(GraphQLInt) },
				status: 	{ type: GraphQLString },
				software_version: { type: GraphQLString },
				url: 		{ type: GraphQLString },
				ip: 		{ type: GraphQLString },
				port: 		{ type: GraphQLInt },
				account:	{ type: GraphQLString },
				password:	{ type: GraphQLString },
				server_id:	{ type: GraphQLString },
				camera_id:	{ type: GraphQLString },
				id:			{ type: GraphQLString },
				name:		{ type: GraphQLString },
				description:{ type: GraphQLString },
				direction: 	{ type: GraphQLInt },
				groups: 	{ type: GraphQLList },
				group_count:{ type: GraphQLInt },
				employee_group	: { type: GraphQLList },
				visitor_group	: { type: GraphQLList },
				blacklist_group	: { type: GraphQLList },
				ldid: 		{ type: GraphQLString },
				type_id: 	{ type: GraphQLInt },
				type_name: 	{ type: GraphQLString },
				update_at: 	{ type: GraphQLString },
				create_at: 	{ type: GraphQLString },
				last_offline_time : { type: GraphQLString },
				config_data:{ type: GraphQLList }
			},
			async resolve(parent, args) {
				const data = await api_v3_device_cameraController.updateapi_v3_device_camera(args)
				return data
			}
		},
		deleteapi_v3_device_camera: {
			type: api_v3_device_cameraType,
			args: {
				id: 		{ type: new GraphQLNonNull(GraphQLID) }
			},
			async resolve(parent, args) {
				const data = await api_v3_device_cameraController.deleteapi_v3_device_camera(args)
				return data
			}
		},

		//ALARM API
		addapi_v2_device_alarm: {
			type: api_v2_device_alarmType,
			args: {
				app_key: 		{ type: new GraphQLNonNull(GraphQLString) },
                sign: 			{ type: new GraphQLNonNull(GraphQLString) },
				timestamp: 		{ type: new GraphQLNonNull(GraphQLString) },
				status:			{ type: GraphQLInt },
				level: 			{ type: GraphQLInt },
				code:			{ type: GraphQLInt },
				description: 	{ type: GraphQLString },
				alarm_time: 	{ type: GraphQLString },
				alarm_timeL: 	{ type: GraphQLString },
				release_time: 	{ type: GraphQLString },
				alarm_photo: 	{ type: GraphQLString },
				reslove_option: { type: GraphQLInt },
				user_id:		{ type: GraphQLID },
				device_id:		{ type: GraphQLID },
				trace_id:		{ type: GraphQLID }
			},
			async resolve(parent, args) {
				const data = await api_v2_device_alarmController.addapi_v2_device_alarm(args)
				return data
			}
		},
		editapi_v2_device_alarm: {
			type: api_v2_device_alarmType,
			args: {
				id: 			{ type: new GraphQLNonNull(GraphQLID) },
				app_key: 		{ type: new GraphQLNonNull(GraphQLString) },
                sign: 			{ type: new GraphQLNonNull(GraphQLString) },
				timestamp: 		{ type: new GraphQLNonNull(GraphQLString) },
				status:			{ type: GraphQLInt },
				level: 			{ type: GraphQLInt },
				code:			{ type: GraphQLInt },
				description: 	{ type: GraphQLString },
				alarm_time: 	{ type: GraphQLString },
				alarm_timeL: 	{ type: GraphQLString },
				release_time: 	{ type: GraphQLString },
				alarm_photo: 	{ type: GraphQLString },
				reslove_option: { type: GraphQLInt },
				user_id:		{ type: GraphQLID },
				device_id:		{ type: GraphQLID },
				trace_id:		{ type: GraphQLID }
			},
			async resolve(parent, args) {
				const data = await api_v2_device_alarmController.updateapi_v2_device_alarm(args)
				return data
			}
		},
		deleteapi_v2_device_alarm: {
			type: api_v2_device_alarmType,
			args: {
				id: 			{ type: new GraphQLNonNull(GraphQLID) }
			},
			async resolve(parent, args) {
				const data = await api_v2_device_alarmController.deleteapi_v2_device_alarm(args)
				return data
			}
		}
	}
})

// Export the schema
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutations
})
