if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const specialistRouter = require("./routes/specialist.js");
const specialistReviewRoutes = require("./routes/specialistReview");
const orderRoutes = require("./routes/orders");
const appointmentRoutes = require("./routes/appointment");
const cartRoutes = require("./routes/cart");
const searchRoutes = require("./routes/search.js");
const adminRoutes = require("./routes/admin");


const dbUrl = process.env.ATLASDB_URL;
if (!dbUrl) {
    throw new Error("ATLASDB_URL is not set. Define it in your environment or .env file.");
}


const sessionDbName = (() => {
    // Prefer explicit env override
    if (process.env.SESSIONS_DB_NAME && process.env.SESSIONS_DB_NAME.trim()) {
        return process.env.SESSIONS_DB_NAME.trim();
    }
    try {
        const withoutQuery = dbUrl.split('?')[0];
        const lastSlash = withoutQuery.lastIndexOf('/');
        const name = lastSlash >= 0 ? withoutQuery.substring(lastSlash + 1) : '';
        return name || 'visionora';
    } catch (e) {
        return 'visionora';
    }
})();

main().then(() => {
    console.log("Connected to db");
}).catch((err) => {
    console.log(err); 
})

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const clientPromise = mongoose.connection.asPromise().then((conn) => conn.getClient());

const store = MongoStore.create({
    clientPromise,
    dbName: sessionDbName,
    collectionName: "sessions",
    serialize: (session) => JSON.stringify(session),
    unserialize: (data) => {
        if (!data) return undefined;
        if (typeof data === "string") {
            try { return JSON.parse(data); } catch { return undefined; }
        }
        return data;
    },
    crypto: { secret: false }
});

store.on("error", (err) => {
    console.error("ERROR in Mongo Store", err);
});

store.collectionP
    .then((collection) => collection.deleteMany({ session: null }))
    .catch(() => {});

const sessionOptions = {
    store,
    name: "visionora.sid",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};





app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());;



app.use((req, res, next) => {
    res.locals.currentUser = req.user; 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/specialists", specialistRouter);
app.use("/specialists/:id/reviews", specialistReviewRoutes);
app.use("/orders",orderRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/cart", cartRoutes);
app.use("/search", searchRoutes);
app.use("/admin", adminRoutes);


app.all(/.*/, (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    if (res.headersSent) {
        // If headers were already sent, delegate to default handler
        return next(err);
    }
    const status = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(status).render("error.ejs", { message, err });
});


app.listen(8080, () => {
    console.log("Server is running on port 8080");
})