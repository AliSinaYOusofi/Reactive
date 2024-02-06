import React from 'react'
import { Text, SectionList, View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        paddingTop: 22,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

// good for sections of data, where data is divided by parts, first headers, then data list, then
// optionally footers
export default function SectionListData() {
    return (
        <View>
            <SectionList
                sections={[
                    {
                        title: "Ds",
                        data: [
                            'Dewana', 'Deb', 'Dob'
                        ]
                    },
                    {
                        title: "J",
                        data: [
                            "Jomething", "jothing"
                        ]
                    }
                ]}
                renderItem={(item) => <Text style={styles.item}> {item} </Text>}
                renderSectionHeader={({section}) => <Text styles={styles.sectionHeader}> {section.title}</Text>
            }
            keyExtractor={item => `basiceSectionList-${item}`}
            />
        </View>
    )
}
