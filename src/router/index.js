import { createRouter, createWebHistory, useRouter } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue"; // Common layout
import LoginView from "@/views/auth/LoginView.vue";
import RegistrationView from "@/views/auth/RegistrationView.vue";
import AddUserView from "@/views/users/AddUserView.vue";
import UpdateUserView from "@/views/users/UpdateUserView.vue";
import AddMusicView from "@/views/musics/AddMusicView.vue";
import UpdateMusicView from "@/views/musics/UpdateMusicView.vue";
import ListMusicView from "@/views/musics/ListMusicView.vue";
import ListArtistView from "@/views/artists/ListArtistView.vue";
import ListUserView from "@/views/users/ListUserView.vue";
import AddArtistView from "@/views/artists/AddArtistView.vue";
import UpdateArtistView from "@/views/artists/UpdateArtistView.vue";
import NotFound from "@/views/NotFound.vue";
import { routeRoles } from "@/utils/permissions";
import { getRoleName } from "@/utils/getRoleName";
import { message } from "ant-design-vue";

function isAuthenticated() {
  return !!localStorage.getItem("token");
}

// export const routeRoles = {
//   "index": ["system_admin", "super_admin", "artist_manager"],
//   "add-user": ["system_admin", "super_admin"],
//   "users-list": ["system_admin", "super_admin"],
//   "add-artist": ["system_admin", "artist_manager"],
//   "edit-artist": ["system_admin", "artist_manager"],
//   "musics-list": ["system_admin", "super_admin", "artist_manager", "artist"],
//   "add-music": ["system_admin", "artist"],
//   "edit-music": ["system_admin", "artist"],
// };

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Routes without layout
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegistrationView,
    },
    // Routes with MainLayout
    {
      path: "/",
      name: "home-index",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "artists-list",
          component: ListArtistView,
        },
        {
          path: "/users",
          name: "users-list",
          component: ListUserView,
        },
        {
          path: "/users/add",
          name: "add-user",
          component: AddUserView,
        },
        {
          path: "/users/edit/:id",
          name: "edit-user",
          component: UpdateUserView,
        },
        {
          path: "/musics/:artistId",
          name: "musics-list",
          component: ListMusicView,
        },
        {
          path: "/musics/add/:artistId",
          name: "add-music",
          component: AddMusicView,
        },
        {
          path: "/musics/edit/:id",
          name: "edit-music",
          component: UpdateMusicView,
        },
        {
          path: "/artists/add",
          name: "add-artist",
          component: AddArtistView,
        },
        {
          path: "/artists/edit/:id",
          name: "edit-artist",
          component: UpdateArtistView,
        },
      ],
    },
    {
      path: "/:catchAll(.*)",
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = isAuthenticated();

  // Redirect to login if trying to access a protected route without authentication
  if (authRequired && !loggedIn) {
    return next("/login");
  }

  // Redirect to home (or protected route) if already logged in and trying to access an auth page
  if (loggedIn && publicPages.includes(to.path)) {
    return next("/");
  }
  const allowedRoles = routeRoles[to.name] || [];
  if (!allowedRoles.includes(getRoleName()) && !publicPages.includes(to.path)) {
    message.info("Sorry, you do not have  permission to access this page.");
    return next(from);
  }
  next();
});

export default router;
