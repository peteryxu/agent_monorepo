import SwiftUI

struct HomeView: View {
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 0) {
                    HeaderBar()
                    StoriesRow(stories: Story.samples)
                    Divider().background(Color(hex: "262626"))

                    ForEach(Post.samples) { post in
                        PostView(post: post)
                    }

                    Spacer(minLength: 80)
                }
            }
        }
    }
}

// MARK: - Header

private struct HeaderBar: View {
    var body: some View {
        HStack {
            Button(action: {}) {
                Image(systemName: "plus")
                    .font(.system(size: 22, weight: .regular))
                    .foregroundStyle(.white)
            }

            Spacer()

            HStack(spacing: 4) {
                Text("Instagram")
                    .font(.custom("Snell Roundhand", size: 28))
                    .fontWeight(.bold)
                    .foregroundStyle(.white)

                Image(systemName: "chevron.down")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(.white)
            }

            Spacer()

            Button(action: {}) {
                ZStack(alignment: .topTrailing) {
                    Image(systemName: "heart")
                        .font(.system(size: 24))
                        .foregroundStyle(.white)

                    Circle()
                        .fill(Color(hex: "FF3040"))
                        .frame(width: 8, height: 8)
                        .offset(x: 2, y: -2)
                }
            }
        }
        .padding(.horizontal, 16)
        .frame(height: 44)
    }
}

// MARK: - Stories

private struct StoriesRow: View {
    let stories: [Story]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 14) {
                ForEach(stories) { story in
                    StoryCircle(story: story)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
        }
    }
}

private struct StoryCircle: View {
    let story: Story

    var body: some View {
        VStack(spacing: 4) {
            ZStack {
                if story.isYourStory {
                    yourStoryAvatar
                } else {
                    gradientRingAvatar
                }
            }
            .frame(width: 68, height: 68)

            Text(story.username)
                .font(.system(size: 11))
                .foregroundStyle(story.isYourStory ? Color(hex: "A8A8A8") : .white)
                .lineLimit(1)
                .frame(width: 72)
        }
    }

    private var yourStoryAvatar: some View {
        ZStack(alignment: .bottomTrailing) {
            Circle()
                .stroke(Color(hex: "363636"), lineWidth: 2)
                .frame(width: 68, height: 68)
                .overlay(
                    Image(systemName: "person.circle.fill")
                        .font(.system(size: 42))
                        .foregroundStyle(Color(hex: "666666"))
                )

            ZStack {
                Circle()
                    .fill(Color(hex: "0095F6"))
                    .frame(width: 20, height: 20)
                    .overlay(
                        Circle()
                            .stroke(.black, lineWidth: 2)
                    )

                Image(systemName: "plus")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundStyle(.white)
            }
            .offset(x: 2, y: 2)
        }
    }

    private var gradientRingAvatar: some View {
        Circle()
            .stroke(
                AngularGradient(
                    colors: [
                        Color(hex: "FEDA75"),
                        Color(hex: "FA7E1E"),
                        Color(hex: "D62976"),
                        Color(hex: "962FBF"),
                        Color(hex: "4F5BD5"),
                        Color(hex: "FEDA75"),
                    ],
                    center: .center
                ),
                lineWidth: 3
            )
            .frame(width: 68, height: 68)
            .overlay(
                Circle()
                    .fill(Color.black)
                    .frame(width: 62, height: 62)
                    .overlay(
                        Image(systemName: story.imageName)
                            .font(.system(size: 24))
                            .foregroundStyle(Color(hex: "A8A8A8"))
                    )
            )
    }
}

#Preview {
    HomeView()
        .preferredColorScheme(.dark)
}
