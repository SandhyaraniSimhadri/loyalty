import { CoreMenu } from "@core/types";

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface
let role_data = JSON.parse(localStorage.getItem("roleinfo"));
let user_data = JSON.parse(localStorage.getItem("currentUser"));

const menuList: CoreMenu[] = [

  {
    id: "company",
    title: "Company",
    translate: "MENU.COMPANY.COLLAPSIBLE",
    type: "collapsible",
    icon: "life-buoy",
    children: [
      {
        id: 'company-list',
        title: 'Company list',
        translate: 'MENU.COMPANY.COMPANY_LIST',
        type: 'item',
        icon: 'circle',
        url: 'company/company'
      },
      {
        // If role is not assigned will be display to all
        id: 'new-company',
        title: 'New Company',
        translate: 'MENU.COMPANY.NEW_COMPANY',
        type: 'item',
        icon: 'circle',
        url: 'company/company-new'
      }
    ]
  },



 


  // {
  //   id: "users",
  //   title: "Users",
  //   translate: "MENU.USERS.USERS",
  //   type: "item",
  //   icon: "life-buoy",
  //   url: "users",
  // },
  {
    id: "predictions",
    title: "Predictions",
    translate: "MENU.PREDICTIONS.PREDICTIONS",
    type: "item",
    icon: "life-buoy",
    url: "predictions/predictions",
  },
  

  {
    id: "users",
    title: "Users",
    translate: "MENU.USERS.COLLAPSIBLE",
    type: "collapsible",
    icon: "life-buoy",
    children: [
      {
        id: 'users-list',
        title: 'Users list',
        translate: 'MENU.USERS.USERS_LIST',
        type: 'item',
        icon: 'circle',
        url: 'users/users'
      },
      {
        // If role is not assigned will be display to all
        id: 'new-user',
        title: 'New user',
        translate: 'MENU.USERS.NEW_USER',
        type: 'item',
        icon: 'circle',
        url: 'users/users-new'
      }
    ]
  },
  {
    id: 'campaigns',
    title: 'Campaigns',
    translate: 'MENU.CAMPAIGNS.COLLAPSIBLE',
    type: 'collapsible',
    // role: ['Admin'], //? To hide collapsible based on user role
    icon: 'home',
    // badge: {
    //   title: '2',
    //   translate: 'MENU.EVENTS.BADGE',
    //   classes: 'badge-light-warning badge-pill'
    // },
    children: [
      {
        id: 'campaigns-list',
        title: 'Campaigns list',
        translate: 'MENU.CAMPAIGNS.CAMPAIGNS_LIST',
        type: 'item',
        icon: 'circle',
        url: 'campaigns/campaigns'
      },
      {
        // If role is not assigned will be display to all
        id: 'new-campaign',
        title: 'New campaign',
        translate: 'MENU.CAMPAIGNS.NEW_CAMPAIGN',
        type: 'item',
        icon: 'circle',
        url: 'campaigns/campaigns-new'
      }
    ]
  },



   {
    id: 'events',
    title: 'Events',
    translate: 'MENU.EVENTS.COLLAPSIBLE',
    type: 'collapsible',
    // role: ['Admin'], //? To hide collapsible based on user role
    icon: 'home',
    // badge: {
    //   title: '2',
    //   translate: 'MENU.EVENTS.BADGE',
    //   classes: 'badge-light-warning badge-pill'
    // },
    children: [
      {
        id: 'events-list',
        title: 'Events list',
        translate: 'MENU.EVENTS.EVENTS_LIST',
        type: 'item',
        icon: 'circle',
        url: 'events/events'
      },
      {
        // If role is not assigned will be display to all
        id: 'new-event',
        title: 'New event',
        translate: 'MENU.EVENTS.NEW_EVENT',
        type: 'item',
        icon: 'circle',
        url: 'events/events-new'
      }
    ]
  },

];

export const getMenu = () => {
  if (user_data?.user_type == 1) {
    // var newMenu: CoreMenu[] = menuList;
    return menuList;
  } 
 else {
    // var newMenu: CoreMenu[] = menuList;
    return menuList;
  }
};

export const menu = getMenu();
