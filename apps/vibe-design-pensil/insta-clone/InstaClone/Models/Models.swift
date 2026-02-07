import Foundation

struct Story: Identifiable {
    let id = UUID()
    let username: String
    let imageName: String
    let isYourStory: Bool

    static let samples: [Story] = [
        Story(username: "Your story", imageName: "person.circle.fill", isYourStory: true),
        Story(username: "congresstheband", imageName: "music.note", isYourStory: false),
        Story(username: "unc_basketball", imageName: "basketball.fill", isYourStory: false),
        Story(username: "cscaa1922", imageName: "figure.pool.swim", isYourStory: false),
        Story(username: "tarheels_fb", imageName: "football.fill", isYourStory: false),
        Story(username: "unc_lacrosse", imageName: "sportscourt.fill", isYourStory: false),
    ]
}

struct Post: Identifiable {
    let id = UUID()
    let username: String
    let isVerified: Bool
    let collaborators: String?
    let audioSource: String?
    let imageName: String
    let likesCount: Int
    let caption: String
    let commentsCount: Int
    let timeAgo: String
    let showFollowButton: Bool

    static let samples: [Post] = [
        Post(
            username: "uncfootball",
            isVerified: true,
            collaborators: "and 2 others",
            audioSource: "accnetwork · Original audio",
            imageName: "football_post",
            likesCount: 1247,
            caption: "The UNC crowd goes wild \u{1F525}",
            commentsCount: 84,
            timeAgo: "2 hours ago",
            showFollowButton: true
        ),
        Post(
            username: "unc_basketball",
            isVerified: true,
            collaborators: nil,
            audioSource: nil,
            imageName: "basketball_post",
            likesCount: 3892,
            caption: "Game day vibes \u{1F3C0}",
            commentsCount: 156,
            timeAgo: "5 hours ago",
            showFollowButton: false
        ),
    ]
}
