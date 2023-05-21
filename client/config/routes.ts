
export default [
    
    {

   
    path: '/',
    component: '../layouts',
    routes: [
        {
          path: '/',
          redirect: '/overview', 
        },
        { path: '/overview', component: '@/pages'},

      { path: "/login", component: "@/pages/Login" },
      { path: "/create", component: "@/pages/Login" },
      { path: "/deposit", component: "@/pages/Deposit" },
      { path: "/withdraw", component: "@/pages/Withdraw" },
      { path: "/transfer", component: "@/pages/Transfer" },
      { path: "/balance", exact: true, component: "@/pages/Balance" },
      { path: "/all", component: "@/pages/All" },
      { path: "/user", component: "@/pages/User" },
    ],
      
  }   
]
