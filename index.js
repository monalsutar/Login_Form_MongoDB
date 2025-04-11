import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { user } from "./schema.js";

const app = express();
const port = 3030;
const _dirname = dirname(fileURLToPath(import.meta.url));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post("/submit", (req, res) => {
    // console.log(_dirname + "/index.html");
    const name = req.body.name
    const prn = req.body.prn
    const mobile = req.body.mobile
    const age = req.body.age
    const email = req.body.email
    const address = req.body.address
    const dpt = req.body.department
    const url = req.body.img_url

    const data = user({
        Name: name,
        PRN: prn,
        Mobile: mobile,
        Age: age,
        Email: email,
        Address: address,
        Dept: dpt,
        URL: url
    })
    data.save()
        .then(() => {
            res.send(`
                <script>
                    alert("Data inserted to Database");
                    window.location.href = "/login";
                </script>
            `);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(`
                <script>
                    alert("Data insertion failed... Please try again");
                    window.location.href = "/";
                </script>
            `);
        });
    // res.send(
    //     `
    //     <script>
            
    //         al   ert("Data inserted to Database")
    //         window.location.href ="/login"
    //     </script>
    //     `
    // )
});

app.post("/fetch", async (req, res) => {
    const useremail = req.body.email;
    const prn = req.body.prn;
    console.log(`Email: ${useremail}, PRN: ${prn}`);

    const userdata = await user.findOne({ Email: useremail });

    // Check if userdata is null before accessing PRN
    if (userdata && userdata.PRN == prn) {
        res.render("fetch.ejs", {
            UserInfo: userdata,
        });
    } else {
        res.redirect('/login'); // Redirect if user is not found or PRN does not match
    }
    
    console.log(userdata); // Logging userdata for debugging
});

app.post("/update", async (req, res) => {
    const username = req.body.name;
    const userprn = req.body.prn;
    const usermobile = req.body.mobile;
    const userage = req.body.age;
    const useraddress = req.body.address;
    const useremail = req.body.email;

    console.log(`Email: ${useremail}, PRN: ${userprn}`);

    // Update user based on PRN (or another unique field)
    const updatedUser = await user.updateOne(
        { PRN: userprn }, // query criteria to find the user
        {
            Name: username,
            PRN : userprn,
            Mobile: usermobile,
            Age: userage,
            Address: useraddress,
            Email: useremail,
        }
    );

    res.send(`
        <script>
            alert("Data updated to Database");
            window.location.href ="/login";
        </script>
    `);
});


app.get("/delete/:prn", async (req, res) => {
    const userprn = req.params.prn; // Use req.query to get the PRN from the query string

    // Check if userprn is provided
    if (!userprn) {
        return res.status(400).send("PRN is required"); // Handle error if PRN is not provided
    }

    try {
        await user.deleteOne({ PRN: userprn });
        
        res.send(
            `
            <script>
                alert("Data deleted from Database");
                window.location.href = "/login";
            </script>
            `
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting data");
    }
});


app.get("/", (req, res) => {
    res.sendFile(_dirname + "/index.html");

})

app.get("/login", (req, res) => {
    res.render("login.ejs");
    

})

app.listen(port, () => {
    console.log("Server Running on 3030");
});

