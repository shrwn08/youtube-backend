import Comments from "../models/comment.models.js";

export const updateComment = async (req, res) => {
  try {
      const {videoId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    console.log(`userid : ${userId} \n videoId : ${videoId} \n content : ${content} \n`);

    if (!content)
      return res.status(400).json({ message: "Content is required" });

    const comment = await Comments.create({userId, videoId, content});
    res.status(200).json({ message: "Comment updated successfully",comment });
  } catch (error) {
    res.status(500).json({ message: "Server error " });
  }
};

export const deleteComment = async (req, res) => {

}

export const editComment = async (req, res) => {

}

export const getComments = async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) return res.status(400).json({ message: "Video ID is required" });
    
    try {
        const comments = await Comments.find({ videoId }).populate("userId", "username");
        res.status(200).json({ message: "Comments fetched successfully", comments });
    } catch (error) {
        res.status(500).json({ message: "Server error " });
    }
}
