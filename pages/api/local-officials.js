import officials from "../../data/officials.json";

export default function handler(req, res) {
  res.status(200).json(officials);
}
