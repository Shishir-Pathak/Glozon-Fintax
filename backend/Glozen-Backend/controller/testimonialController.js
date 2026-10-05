import Testimonial from "../model/testimonialModel.js";

const DEFAULT_TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    position: "Director, Sydney Accounting Group",
    image: "/testimonial-1.jpg",
    text: "Glozon FinTax has transformed the way we manage our offshore accounting operations. Their accuracy, responsiveness, and deep understanding of Australian compliance requirements are exceptional.",
  },
  {
    name: "Rajesh Mehta",
    position: "Founder, Mehta Exports",
    image: "/testimonial-2.jpg",
    text: "The team provides outstanding bookkeeping and payroll support. We have reduced operational costs significantly while improving reporting quality and turnaround time.",
  },
  {
    name: "Aisha Al Mansoori",
    position: "Finance Manager, Dubai Ventures",
    image: "/testimonial-3.jpg",
    text: "Professional, reliable, and highly confidential. Their advisory support helped us streamline compliance and make better financial decisions for our growing business.",
  },
];

export async function getTestimonials(req, res) {
  try {
    let testimonials = await Testimonial.findAll({
      order: [["id", "ASC"]],
    });

    if (testimonials.length === 0) {
      // Auto-seed defaults if table is empty
      await Testimonial.bulkCreate(DEFAULT_TESTIMONIALS);
      testimonials = await Testimonial.findAll({ order: [["id", "ASC"]] });
    }

    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Error in getTestimonials:", error);
    res.status(200).json(DEFAULT_TESTIMONIALS);
  }
}

export async function addTestimonial(req, res) {
  try {
    const { name, position, text, image } = req.body;
    if (!name || !position || !text) {
      return res.status(400).json({ message: "Name, position, and testimonial text are required" });
    }

    const newTestimonial = await Testimonial.create({
      name,
      position,
      text,
      image: image || "/Logo.png",
    });

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error("Error in addTestimonial:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTestimonial(req, res) {
  try {
    const { id } = req.params;
    const { name, position, text, image } = req.body;

    await Testimonial.update(
      { name, position, text, image },
      { where: { id } }
    );

    res.status(200).json({
      message: "Testimonial updated successfully",
    });
  } catch (error) {
    console.error("Error in updateTestimonial:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTestimonial(req, res) {
  try {
    const { id } = req.params;
    await Testimonial.destroy({ where: { id } });
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTestimonial:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
