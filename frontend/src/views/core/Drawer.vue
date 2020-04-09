<template>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
       <v-list>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>KSS cloud 3.3</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>


     <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              :to="{path: '/index'+child.to}"
              link
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            :to="{path: '/index'+item.to}"
            link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
</template>


<script>
  export default {

    name: 'Drawer',
    data: () => ({
      dialog: false,
      drawer: false,
      items: [
        { icon: 'trending_up', text: 'Dashboard', to: '/dashboard'},
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: 'Personnel Management',
          model: false,
          children: [
            { text: 'Employee Management', to: '/employee' },
            { text: 'Employee Group Management', to: '/employeegroup' },
            { text: 'Visitor Management', to: '/Device/Device' },
            { text: 'Visitor Group Management', to: '/Device/Device' },
            { text: 'Blakclist Management', to: '/Device/Device' },
            { text: 'Blakclist Group Management', to: '/Device/Device' },
            { text: 'Registration Record', to: '/Device/Device' },
            { text: 'Search By Pitures', to: '/Device/Device' },
          ],
        },
                {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: 'Device Management',
          model: false,
          children: [
            { text: 'Device List' ,to: '/device'},
          ],
        },
                {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: 'Attendance Management',
          model: false,
          children: [
            { text: 'Attendance Rules', to:"/attendancerules" },
            { text: 'Attendance Area' },
            { text: 'Attendance Records' },
            { text: 'Attendance Statistics' },
          ],
        },
        {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: 'System Management',
          model: false,
          children: [
            { text: 'Enterprise Information' },
            { text: 'Account Permission' },
            { text: 'Operation Log' },
            { text: 'Open Platform' },
          ],
        },
      ],
    }),
  }
</script>
