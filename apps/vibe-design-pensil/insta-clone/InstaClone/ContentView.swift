import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0

    var body: some View {
        ZStack(alignment: .bottom) {
            TabContent(selectedTab: selectedTab)

            TabBar(selectedTab: $selectedTab)
        }
        .ignoresSafeArea(.keyboard)
    }
}

private struct TabContent: View {
    let selectedTab: Int

    var body: some View {
        switch selectedTab {
        case 0: HomeView()
        case 1: PlaceholderTab(icon: "play.rectangle", title: "Reels")
        case 2: PlaceholderTab(icon: "plus.app", title: "Create")
        case 3: PlaceholderTab(icon: "magnifyingglass", title: "Search")
        case 4: PlaceholderTab(icon: "person.circle", title: "Profile")
        default: HomeView()
        }
    }
}

private struct PlaceholderTab: View {
    let icon: String
    let title: String

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            VStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 40))
                    .foregroundStyle(.gray)
                Text(title)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(.gray)
            }
        }
    }
}

private struct TabBar: View {
    @Binding var selectedTab: Int

    private let tabs: [(icon: String, filledIcon: String, label: String)] = [
        ("house", "house.fill", "Home"),
        ("play.rectangle", "play.rectangle.fill", "Reels"),
        ("arrow.up.right.square", "arrow.up.right.square.fill", "Post"),
        ("magnifyingglass", "magnifyingglass", "Search"),
        ("person.circle", "person.circle.fill", "Profile"),
    ]

    var body: some View {
        VStack(spacing: 0) {
            Divider()
                .background(Color(hex: "262626"))

            HStack {
                ForEach(0..<tabs.count, id: \.self) { index in
                    TabBarItem(
                        icon: selectedTab == index ? tabs[index].filledIcon : tabs[index].icon,
                        isSelected: selectedTab == index,
                        hasNotification: index == 2
                    ) {
                        selectedTab = index
                    }
                }
            }
            .padding(.horizontal, 24)
            .padding(.top, 8)
            .padding(.bottom, 4)
            .background(Color.black)
        }
    }
}

private struct TabBarItem: View {
    let icon: String
    let isSelected: Bool
    let hasNotification: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack(alignment: .topTrailing) {
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundStyle(isSelected ? .white : Color(hex: "A8A8A8"))
                    .frame(maxWidth: .infinity)
                    .frame(height: 32)

                if hasNotification {
                    Circle()
                        .fill(Color(hex: "FF3040"))
                        .frame(width: 6, height: 6)
                        .offset(x: -10, y: 0)
                }
            }
        }
    }
}

#Preview {
    ContentView()
        .preferredColorScheme(.dark)
}
