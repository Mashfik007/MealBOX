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
  
  
          <NavLink to={'requested_meal'}>
            <ListItem>
              <ListItemPrefix>
                <img src={users} alt="" />
              </ListItemPrefix>
              Requested meal
            </ListItem></NavLink>
          <NavLink to={'user_review'}>
  
            <ListItem>
              <ListItemPrefix>
                <ShoppingBagIcon className="h-5 w-5" />
              </ListItemPrefix>
              My Reviews
            </ListItem>
          </NavLink>
  
  <NavLink to={'payment_history'}>
          <ListItem>
            <ListItemPrefix>
              <img src={meals} alt="" />
            </ListItemPrefix>
          Payment History
          </ListItem></NavLink>
  
   
        </List>
      </Card>
    );
  }