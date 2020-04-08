// Import external dependancies
const faker = require('faker')
const boom = require('boom')

// Import internal dependancies
const fastify = require('../server.js')

// Fake data
const Authorized_accesss = [
	{
        name: '정찬우',
        company: 'koolsign',
		data: ['정-A', '정-B', '정-C', '정-D']
	},
	{
        name: '김설희',
        company: '백수',
		data: ['김-A', '김-B', '김-C', '김-D']
	}
]

const user_id_Garages = ['Admin', "Gary'sGarage", 'SuperService', 'iGarage', 'BestService']
const user_pw_Garages = ['12345']
const user_lang_Garages = ['en-KR', 'en-US']

// Get Data Models
const Authorized_access = require('../models/Authorized_access')
const User = require('../models/User')
const All_Access = require('../models/All_access')

// Fake data generation functions
const generateUserData = () => {
	let UserData = []
	let i = 0

	while (i < 5) {
        const user_id = faker.random.arrayElement(user_id_Garages)
        const user_pw = faker.random.arrayElement(user_pw_Garages)
        const user_lang = faker.random.arrayElement(user_lang_Garages)
		const user_name = faker.fake("{{name.lastName}}")

		const user = {
			user_id,
			user_pw,
            user_lang,
            user_name
		}

		UserData.push(user)
		i++
	}

	return UserData
}

const generateAuthorized_accessData = usersIds => {
	let Authorized_accessData = []
	let i = 0
    
	while (i < 10) {
		const user_fkid = faker.random.arrayElement(usersIds)
		const Authorized_accesss_Object = faker.random.arrayElement(Authorized_accesss)
        const name = Authorized_accesss_Object.name
        const company = Authorized_accesss_Object.company
        const data = faker.random.arrayElement(Authorized_accesss_Object.data)

		const authorized_access = {
			user_fkid,
			name,
			company,
			data
        }

		Authorized_accessData.push(authorized_access)
		i++
	}

	return Authorized_accessData
}

const generateAll_accessData = Authorized_accessIds => {
	let All_accessData = []
    let i = 0
    
	while (i < 5) {
        const authorized_access_fkid = faker.random.arrayElement(Authorized_accessIds.authorized['0'])
        const device_fkid = faker.random.arrayElement(Authorized_accessIds.user['0'])
        const safe_status = 'N'
        const recognized_data = 'TEST'
        const date = faker.fake("{{date.past}}")
        const statistics_process_status = 'N'

		const All_access = {
            authorized_access_fkid,
            device_fkid,
			safe_status,
			recognized_data,
            date,
            statistics_process_status
		}

		All_accessData.push(All_access)
		i++
	}

	return All_accessData
}

fastify.ready().then(
	async () => {
		try {
			const users = await User.insertMany(generateUserData())
			const usersIds = users.map(x => x._id)

			const Authorized_accesss = await Authorized_access.insertMany(generateAuthorized_accessData(usersIds))
			const Authorized_accessIds = Authorized_accesss.map(x => x._id)

            const Access_random = [];
            Access_random.user = [];
            Access_random.authorized = [];
            Access_random.user.push(usersIds)
            Access_random.authorized.push(Authorized_accessIds)
			const All_Accesss = await All_Access.insertMany(generateAll_accessData(Access_random))

			console.log(`
      Data successfully added:
        - ${users.length} users added.
        - ${Authorized_accesss.length} Authorized_accesss added.
        - ${All_Accesss.length} All_Accesss added.
      `)
		} catch (err) {
			throw boom.boomify(err)
		}
		process.exit()
	},
	err => {
		console.log('An error occured: ', err)
		process.exit()
	}
)
