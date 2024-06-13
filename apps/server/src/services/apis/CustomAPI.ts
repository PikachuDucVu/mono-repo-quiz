import { Hono } from "hono";

export const CustomAPI = (app: Hono, currentServerTime: string) => {
  app.get("/student/minh/foodList", (c) => {
    console.log("GET /student/minh/foodList");
    return c.json([
      {
        name: "Spicy Sichuan Noodles",
        price: 12.99,
        description:
          "Hand-pulled noodles tossed in a fiery Sichuan peppercorn sauce with ground pork, bok choy, and peanuts.",
      },
      {
        name: "Pad Thai",
        price: 10.99,
        description:
          "Classic Thai street food with rice noodles, tofu, shrimp, peanuts, and a tangy tamarind sauce.",
      },
      {
        name: "Ramen",
        price: 11.99,
        description:
          "Rich and flavorful Japanese noodle soup with pork broth, ramen noodles, marinated egg, bamboo shoots, and seaweed.",
      },
      {
        name: "Udon Noodle Soup",
        price: 9.99,
        description:
          "Thick, chewy udon noodles in a savory dashi broth with tempura shrimp, vegetables, and a soft-boiled egg.",
      },
      {
        name: "Spaghetti Carbonara",
        price: 13.99,
        description:
          "Creamy Italian pasta dish with spaghetti, pancetta, eggs, Parmesan cheese, and black pepper.",
      },
      {
        name: "Mac and Cheese",
        price: 8.99,
        description:
          "Classic comfort food with elbow macaroni, creamy cheese sauce, and a crispy breadcrumb topping.",
      },
      {
        name: "Lasagna",
        price: 14.99,
        description:
          "Layered pasta dish with sheets of pasta, meat sauce, béchamel sauce, and ricotta cheese.",
      },
      {
        name: "Linguine with Clam Sauce",
        price: 15.99,
        description:
          "Fresh linguine pasta tossed in a garlicky white wine sauce with clams, olive oil, and parsley.",
      },
      {
        name: "Pho",
        price: 10.99,
        description:
          "Vietnamese noodle soup with rice noodles, broth, meat (beef, chicken, or tofu), herbs, and bean sprouts.",
      },
      {
        name: "Lo Mein",
        price: 11.99,
        description:
          "Stir-fried Chinese noodles with vegetables, meat, and a savory sauce.",
      },
      {
        name: "Ramen with Miso Broth",
        price: 12.99,
        description:
          "Japanese noodle soup with ramen noodles, miso broth, marinated egg, seaweed, and scallions.",
      },
      {
        name: "Spaghetti Aglio e Olio",
        price: 10.99,
        description:
          "Simple but delicious Italian pasta dish with spaghetti, garlic, olive oil, and red pepper flakes.",
      },
      {
        name: "Penne Arrabbiata",
        price: 11.99,
        description:
          "Spicy Italian pasta dish with penne pasta, tomato sauce, garlic, chili peppers, and basil.",
      },
      {
        name: "Chicken Noodle Soup",
        price: 8.99,
        description:
          "Comforting soup with egg noodles, chicken, vegetables, and a flavorful broth.",
      },
      {
        name: "Beef and Broccoli Noodles",
        price: 13.99,
        description:
          "Stir-fried noodles with tender beef, broccoli florets, and a savory brown sauce.",
      },
      {
        name: "Shrimp Scampi",
        price: 16.99,
        description:
          "Italian dish with linguine pasta, shrimp, garlic, white wine, and lemon juice.",
      },
      {
        name: "Tuna Noodle Casserole",
        price: 9.99,
        description:
          "Classic casserole with egg noodles, tuna, cream of mushroom soup, and a crispy topping.",
      },
      {
        name: "Fettuccine Alfredo",
        price: 14.99,
        description:
          "Creamy Italian pasta dish with fettuccine noodles, butter, Parmesan cheese, and cream.",
      },
      {
        name: "Spicy Peanut Noodles",
        price: 11.99,
        description:
          "Cold noodles tossed in a spicy peanut sauce with vegetables, peanuts, and cilantro.",
      },
      {
        name: "Ramen with Kimchi",
        price: 13.99,
        description:
          "Spicy Korean-inspired ramen with ramen noodles, kimchi, pork broth, and a poached egg.",
      },
    ]);
  });
  app.get("student/hieu/tourList", (c) => {
    console.log("GET /student/hieu/tourList");
    const data = [
      {
        route: "HaNoi - TP.HCM",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "HN - ICH",
        price: 189,
        time: "18h45 - 21h00",
      },
      {
        time: "18h - XX",
      },
      {
        route: "HaNoi - DaNang",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "HaNoi - Bangkok",
        price: 189,
        time: "19h20 - 21h40",
      },
      {
        route: "HaNoi - Vinh",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "HaNoi - NewYork",
        price: 189,
        time: "20h - XX",
      },
      {
        route: "HaNoi - PhuQuoc",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "HaNoi - Tokyo",
        price: 189,
        time: "20h35 - XX",
      },
      {
        route: "TP.HCM - HaNoi",
        price: 90,
        time: "20h55 - XX",
      },
      {
        route: "TP.HCM - Seoul",
        price: 189,
        time: "18h45 - 21h00",
      },
      {
        route: "TP.HCM - Hue",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "TP.HCM - Busan",
        price: 189,
        time: "21h15 - XX",
      },
      {
        route: "DaNang - TPHCM",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "HaNoi - Paris",
        price: 189,
        time: "21h45 - XX",
      },
      {
        route: "DaNang - PhuQuoc",
        price: 90,
        time: "22h - XX",
      },
      {
        route: "TP.HCM - Incheon",
        price: 189,
        time: "18h45 - 21h00",
      },
    ];
    return c.json(data);
  });
  app.get("student/hieu/tourList/:name", (c) => {
    const data = [
      {
        route: "HaNoi - TP.HCM",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "HN - ICH",
        price: 189,
        time: "18h45 - 21h00",
      },
      {
        route: "HaNoi - DaNang",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "HaNoi - Bangkok",
        price: 189,
        time: "19h20 - 21h40",
      },
      {
        route: "HaNoi - Vinh",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "HaNoi - NewYork",
        price: 189,
        time: "20h - XX",
      },
      {
        route: "HaNoi - PhuQuoc",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "HaNoi - Tokyo",
        price: 189,
        time: "20h35 - XX",
      },
      {
        route: "TP.HCM - HaNoi",
        price: 90,
        time: "20h55 - XX",
      },
      {
        route: "TP.HCM - Seoul",
        price: 189,
        time: "18h45 - 21h00",
      },
      {
        route: "TP.HCM - Hue",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "TP.HCM - Busan",
        price: 189,
        time: "21h15 - XX",
      },
      {
        route: "DaNang - TPHCM",
        price: 90,
        time: "18h45 - 21h00",
      },
      {
        route: "HaNoi - Paris",
        price: 189,
        time: "21h45 - XX",
      },
      {
        route: "DaNang - PhuQuoc",
        price: 90,
        time: "22h - XX",
      },
      {
        route: "TP.HCM - Incheon",
        price: 189,
        time: "18h45 - 21h00",
      },
    ];
    const name = c.req.param("name");
    console.log("GET /student/hieu/tourList/", name);
    return c.json(
      data.filter((item) =>
        item.route.toLowerCase().includes(name.toLowerCase())
      )
    );
  });
};
