import SwiftUI

struct PostView: View {
    let post: Post

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            PostHeader(post: post)
            PostImage(imageName: post.imageName)
            EngagementBar()
            PostMeta(post: post)
        }
    }
}

// MARK: - Post Header

private struct PostHeader: View {
    let post: Post

    var body: some View {
        HStack(spacing: 8) {
            // Avatar
            Circle()
                .fill(Color(hex: "333333"))
                .frame(width: 32, height: 32)
                .overlay(
                    Image(systemName: "person.fill")
                        .font(.system(size: 14))
                        .foregroundStyle(Color(hex: "666666"))
                )

            // Username + audio
            VStack(alignment: .leading, spacing: 1) {
                HStack(spacing: 4) {
                    Text(post.username)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(.white)

                    if post.isVerified {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 12))
                            .foregroundStyle(Color(hex: "0095F6"))
                    }

                    if let collaborators = post.collaborators {
                        Text(collaborators)
                            .font(.system(size: 13))
                            .foregroundStyle(.white)
                    }
                }

                if let audio = post.audioSource {
                    HStack(spacing: 4) {
                        Image(systemName: "music.note")
                            .font(.system(size: 9))
                            .foregroundStyle(Color(hex: "A8A8A8"))

                        Text(audio)
                            .font(.system(size: 11))
                            .foregroundStyle(Color(hex: "A8A8A8"))
                    }
                }
            }

            Spacer()

            if post.showFollowButton {
                Button(action: {}) {
                    Text("Follow")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 6)
                        .background(Color(hex: "262626"))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color(hex: "363636"), lineWidth: 1)
                        )
                }
            }

            Button(action: {}) {
                Image(systemName: "ellipsis")
                    .font(.system(size: 14))
                    .foregroundStyle(.white)
            }
        }
        .padding(.horizontal, 12)
        .frame(height: 52)
    }
}

// MARK: - Post Image

private struct PostImage: View {
    let imageName: String

    var body: some View {
        Rectangle()
            .fill(Color(hex: "1A1A1A"))
            .aspectRatio(1, contentMode: .fit)
            .overlay(
                Image(systemName: "photo")
                    .font(.system(size: 48))
                    .foregroundStyle(Color(hex: "333333"))
            )
    }
}

// MARK: - Engagement Bar

private struct EngagementBar: View {
    var body: some View {
        HStack {
            HStack(spacing: 16) {
                Button(action: {}) {
                    Image(systemName: "heart")
                        .font(.system(size: 24))
                        .foregroundStyle(.white)
                }

                Button(action: {}) {
                    Image(systemName: "message")
                        .font(.system(size: 22))
                        .foregroundStyle(.white)
                }

                Button(action: {}) {
                    Image(systemName: "paperplane")
                        .font(.system(size: 22))
                        .foregroundStyle(.white)
                }
            }

            Spacer()

            Button(action: {}) {
                Image(systemName: "bookmark")
                    .font(.system(size: 22))
                    .foregroundStyle(.white)
            }
        }
        .padding(.horizontal, 12)
        .frame(height: 46)
    }
}

// MARK: - Post Meta

private struct PostMeta: View {
    let post: Post

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("\(post.likesCount.formatted()) likes")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.white)

            HStack(spacing: 4) {
                Text(post.username)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(.white)

                Text(post.caption)
                    .font(.system(size: 13))
                    .foregroundStyle(.white)
            }

            Text("View all \(post.commentsCount) comments")
                .font(.system(size: 13))
                .foregroundStyle(Color(hex: "A8A8A8"))

            Text(post.timeAgo)
                .font(.system(size: 11))
                .foregroundStyle(Color(hex: "666666"))
        }
        .padding(.horizontal, 12)
        .padding(.bottom, 16)
    }
}

#Preview {
    ScrollView {
        PostView(post: Post.samples[0])
    }
    .background(.black)
    .preferredColorScheme(.dark)
}
