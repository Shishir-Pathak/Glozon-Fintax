import Team from "../model/teamModel.js";

export async function getAllTeams(req, res) {
  try {
    const teams = await Team.findAll();
    res.status(200).json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addTeam(req, res) {
  try {
    const { name, position, bio, imageUrl } = req.body;
    if (!name || !position) {
      return res
        .status(400)
        .json({ message: "Name and position are required" });
    }
    const newTeam = await Team.create({ name, position, bio, imageUrl });
    res.status(201).json({
      message: "Team member added successfully",
      teamId: newTeam.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function editTeam(req, res) {
  try {
    const { id } = req.params;
    const { name, position, bio, imageUrl } = req.body;
    if (!(name && position && bio)) {
      return res.status(400).json({
        message: "Invalid",
      });
    }
    await Team.update(
      {
        name,
        position,
        bio,
        imageUrl,
      },
      {
        where: { id: id },
      },
    );
    res.status(200).json({
      message: "Edited successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteTeam(req, res) {
  try {
    const { id } = req.params;
    await Team.destroy({
      where: { id: id },
    });
    res.status(200).json({
      message: "Deleted Successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json("Internal Server Error");
  }
}
