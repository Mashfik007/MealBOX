import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

import users from "../../assets/group.svg";
import meals from "../../assets/meals.svg";
import review from "../../assets/review.svg";
import serve_meal from "../../assets/serve_meal.svg";
import upcoming_meal from "../../assets/upcoming_meal.svg";
import { NavLink } from "react-router-dom";

export function DefaultSidebar() {
  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Sidebar
        </Typography>
      </div>
      <List>
        <NavLink to={'profile'}>
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />

            </ListItemPrefix>
            Profile
          </ListItem>
        </NavLink>


        <NavLink to={'manage_user'}>
          <ListItem>
            <ListItemPrefix>
              <img src={users} alt="" />
            </ListItemPrefix>
            Manage Users
          </ListItem></NavLink>
        <NavLink to={'add_meal'}>

          <ListItem>
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            Add Meal
          </ListItem>
        </NavLink>

<NavLink to={'all_meal'}>
        <ListItem>
          <ListItemPrefix>
            <img src={meals} alt="" />
          </ListItemPrefix>
          All Meals
        </ListItem></NavLink>

   <NavLink to={'all_reviews'}>     <ListItem>
          <ListItemPrefix>
            <img src={review} alt="" />
          </ListItemPrefix>
          All Reviews
        </ListItem></NavLink>

        <NavLink to={'serve_meal'}>
        <ListItem>
          <ListItemPrefix>
            <img src={serve_meal} alt=""  />
          </ListItemPrefix>
          Serve Meals

        </ListItem></NavLink>

        <NavLink to={'upcoming_meal'}>
        <ListItem>
          <ListItemPrefix>
            <img src={upcoming_meal} alt="" />
          </ListItemPrefix>
          Upcoming Meals

        </ListItem></NavLink>
      </List>
    </Card>
  );
}