import Contact from "../model/contactModel.js";

export async function submitContactForm(req, res) {
  try {
    const { name, email, message, country, subject, phoneNumber } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newContactForm = await Contact.create({
      name,
      email,
      message,
      country,
      subject,
      phoneNumber,
    });
    console.log("New contact form submitted:", newContactForm);
    res.status(201).json({
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getContactForms(req, res) {
  try {
    const contactForms = await Contact.findAll();
    res.status(200).json(contactForms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteContact(req, res) {
  try {
    const { id } = req.params;
    res.status(200).json({ message: "Contact deleted successfully" });
    await Contact.destroy({ where: { id } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
}
