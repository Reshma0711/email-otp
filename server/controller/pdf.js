const fs = require("fs");
const pdfParse = require("pdf-parse");
const QuestionSet = require("../model/pdf");

function parseQuestions(text) {
  const questionBlocks = text.split(/(?=\d+\.\s)/).filter((q) => q.trim());

  const formattedQuestions = questionBlocks
    .map((block) => {
      const lines = block.trim().split("\n");
      const questionRaw = lines.find((line) => /^\d+\./.test(line));
      if (!questionRaw) return null; // 👈 Skip invalid question blocks

      const questionLine = questionRaw.replace(/^\d+\.\s*/, "");
      const options = lines.filter((line) => /^[A-D]\./.test(line));
      const answerLine = lines.find((line) => /^Answer:/.test(line));
      const correctOption = answerLine?.split(":")[1]?.trim();

      const formattedOptions = options.map((option) => {
        const label = option[0];

        const key = label.toLowerCase(); // 'a', 'b', 'c', or 'd'

        console.log("key", key);

        console.log("optionnnnnnnnnnnnnn", label);
        const text = option.slice(3).trim();
        console.log("text", text);
        return {
          [label]: text,
          ans: label === correctOption,
        };
      });
      console.log("formattedOPtions", formattedOptions);

      return {
        question: questionLine,
        options: formattedOptions,
      };
    })
    .filter((q) => q !== null); // 👈 Filter out null (invalid) entries
  console.log("formattedQuestions", formattedQuestions);
  console.log("formattedQuestions", formattedQuestions[1].options[0]);

  return formattedQuestions;
}

exports.uploadPDF = async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);
    const questions = parseQuestions(data.text);

    const saved = await QuestionSet.create({ questions });

    res.json({ message: "Questions stored as a set", data: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
};
