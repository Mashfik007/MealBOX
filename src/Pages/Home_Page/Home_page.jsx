import React, { useContext } from "react";
import Footer from "../../Components/Footer/Footer";
import gold from "../../assets/Gold.jpg";
import Silver from "../../assets/silver.jpg";
import platinum from "../../assets/Platinum.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import food from "../../assets/food.jpg";
import TabsDefault from "../../Components/TAB/TabsDefault";
import UserContext from "../../Hooks/Context/User_context";
import { button } from "@material-tailwind/react";

const Home_page = () => {
  const { User } = useContext(UserContext)
  return (
    <div>
      {/* Navbar */}
      <Navbar></Navbar>

      {/* Banner Section */}
      <section
        className="relative w-full h-96 text-white flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url(${food})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="text-4xl font-bold">Welcome to MealSite</h1>
        <p className="text-lg mt-2">Your one-stop solution for all meals</p>
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            className="p-2 rounded"
            placeholder="Search for meals..."
          />
          <button className="bg-blue-600 px-4 py-2 rounded">Search</button>
        </div>
      </section>


      {/* Meals by Category */}
      <section className="p-10">
        <TabsDefault></TabsDefault>

      </section>

      {/* Membership Section */}
      <section className="py-8 h-96 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">
          Upgrade to Premium
        </h2>
        <div className="flex justify-center space-x-6">
          {/* Silver Package */}
          <div className="bg-white p-6 shadow-lg rounded-lg w-64">
            <img src={Silver} alt="" />
            <h3 className="text-xl font-bold">Silver</h3>
            <p className="text-gray-600">Price: $20/month</p>
            {
              User ? (
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  <NavLink
                    to={`/checkout?data=${encodeURIComponent(JSON.stringify({ price: "20", name: "Silver", image: Silver }))}`}
                  >
                    Purchase
                  </NavLink>
                </button>
              ) : (
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  <NavLink to={'/login'}>
                    Purchase
                  </NavLink>
                </button>
              )
            }

          </div>
          {/* Gold Package */}
          <div className="bg-white p-6 shadow-lg rounded-lg w-64">
            <img src={gold} alt="" />
            <h3 className="text-xl font-bold">Gold</h3>
            <p className="text-gray-600">Price: $40/month</p>
            {
              User ? (
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  <NavLink
                    to={`/checkout?data=${encodeURIComponent(JSON.stringify({ price: "40", name: "Gold", image: Silver }))}`}
                  >
                    Purchase
                  </NavLink>
                </button>
              ) : (
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  <NavLink to={'/login'}>
                    Purchase
                  </NavLink>
                </button>
              )
            }
          </div>
          {/* Platinum Package */}
          <div className="bg-white p-6 shadow-lg rounded-lg w-64">
            <img src={platinum} alt="" />
            <h3 className="text-xl font-bold">Platinum</h3>
            <p className="text-gray-600">Price: $60/month</p>
            {
              User ? (
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  <NavLink
                    to={`/checkout?data=${encodeURIComponent(JSON.stringify({ price: "80", name: "Platinum"}))}`}
                  >
                    Purchase
                  </NavLink>
                </button>
              ) : (
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                  <NavLink to={'/login'}>
                    Purchase
                  </NavLink>
                </button>
              )
            }
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer></Footer>
    </div>
  );
};

export default Home_page;
