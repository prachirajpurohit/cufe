import mongoose from "mongoose";

const myDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("❌ MONGO_URI not set in environment (.env file missing or variable empty)");
      process.exit(1);
    }

    const connInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "✅ MongoDB connected successfully! DB host: ",
      connInstance.connection.host,
    );
  } catch (error) {
    console.log("❌ MongoDB connection error", error);
    process.exit(1);
  }

  // const kittySchema = new mongoose.Schema({
  //   name: String,
  // });

  // // NOTE: methods must be added to the schema before compiling it with mongoose.model()
  // kittySchema.methods.speak = function speak() {
  //   const greeting = this.name
  //     ? "Meow name is " + this.name
  //     : "I don't have a name";
  //   console.log(greeting);
  // };

  // const Kitten = mongoose.model("Kitten", kittySchema);

  // const silence = new Kitten({ name: "Silence" });
  // console.log(silence.name); // 'Silence'

  // const fluffy = new Kitten({ name: "fluffy" });
  // fluffy.speak(); // "Meow name is fluffy"

  // await fluffy.save();

  // const kittens = await Kitten.find();
  // console.log(kittens);

  // await Kitten.find({ name: /^fluff/ });
};

export default myDB;
