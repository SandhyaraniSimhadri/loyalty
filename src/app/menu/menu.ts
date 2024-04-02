import { CoreMenu } from "@core/types";

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface
let role_data = JSON.parse(localStorage.getItem("roleinfo"));
let user_data = JSON.parse(localStorage.getItem("currentUser"));

const menuList: CoreMenu[] = [

  {
    id: "company",
    title: "Company",
    translate: "MENU.COMPANY.COMPANY",
    type: "item",
    icon: "life-buoy",
    url: "company",
  },
  {
    id: "events",
    title: "Events",
    translate: "MENU.EVENTS.EVENTS",
    type: "item",
    icon: "life-buoy",
    url: "events",
  },

  {
    id: "users",
    title: "Users",
    translate: "MENU.USERS.USERS",
    type: "item",
    icon: "life-buoy",
    url: "users",
  },
  {
    id: "campaigns",
    title: "Campaigns",
    translate: "MENU.CAMPAIGNS.CAMPAIGNS",
    type: "item",
    icon: "life-buoy",
    url: "campaigns",
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
