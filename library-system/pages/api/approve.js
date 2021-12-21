// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import libraryRecord from "@ethereum/libraryRecord";

export default async function handler(req, res) {
  const { librarian, student } = req.body;
  // console.log(librarian.toString(), student.toString());

  if (req.method === "POST") {
    if (librarian === process.env.LIBRARIAN_ADDRESS) {
      await libraryRecord.methods
        .validateReturn(librarian, true, student)
        .send({ from: librarian });

      res.status(200).json({ message: process.env.LIBRARIAN_ADDRESS });
    } else {
      console.log("not the librarian");
      res.status(400).json({ message: "User not authorized for this actions" });
    }
  } else {
    res.setHeaders("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
