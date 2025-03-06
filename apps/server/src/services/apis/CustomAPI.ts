import { Hono } from "hono";

export const CustomAPI = (app: Hono, currentServerTime: string) => {
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
    return c.json(
      data.filter((item) =>
        item.route.toLowerCase().includes(name.toLowerCase())
      )
    );
  });
};
