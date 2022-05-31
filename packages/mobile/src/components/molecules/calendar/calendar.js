import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import moment from 'moment';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDate = new Date().getDate();
const nextYear = moment().add(1, 'years').format('YYYY');
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const Calendar = ({unselectedYearColor=colors.white, unselectedMonthColor=colors.white,dayMonthYear, setDayMonthYear, style,monthStyle,yearStyle,dayStyle,dayContainerStyle, }) => {
    const scrollViewRef = React.useRef(null);
    const scrollViewRef2 = React.useRef(null);
    const [month, setMonth] = React.useState([]);
    const itemWidth = mvs( 46);

    const getFullMonthCalendar = (year, month) => {
        const fullMonths = TAKE_TO_CONSTANT.getMonth(parseInt(year), parseInt(month));
        setMonth(fullMonths);
    }
    React.useEffect(() => {
        scrollToIndex()
        const date = new Date();
        getFullMonthCalendar(date.getFullYear(), date.getMonth()+1);
    }, []);
    const scrollToIndex = () => {
        if (scrollViewRef2.current !== null) {
            scrollViewRef2.current.scrollTo({
                x: itemWidth * currentMonth,
                animated: true,
            });
        }
        if (scrollViewRef.current !== null) {
            scrollViewRef.current.scrollTo({
                x: itemWidth * (currentDate - 1),
                animated: true,
            });
        }
    };
    return (
        <View style={[styles.CALENDAR, style]}>
            <Regular label={'Choose Date'} style={{color:colors.primary,fontSize:mvs(18),alignSelf:'center',marginBottom:mvs(29)}}/>
            <View style={[{ flexDirection: 'row' }, {justifyContent:'center',marginBottom:mvs(30)}]}>
                <Buttons.ButtonSecondaryOutline
                    onClick={() => {
                        getFullMonthCalendar(currentYear, dayMonthYear.month + 1);
                        setDayMonthYear({ ...dayMonthYear, year: currentYear, day: currentDate, month: currentMonth });
                    }}
                    title={currentYear}
                    textStyle={{ color: dayMonthYear.year == currentYear ? colors.white : colors.typeHeader, fontSize: mvs(15), fontFamily: fonts.carosSoftMedium }}
                    style={{ width: mvs(100), height:  mvs(38), backgroundColor: dayMonthYear.year === currentYear ? colors.primary : unselectedYearColor, }}
                />
                <Buttons.ButtonSecondaryOutline
                    onClick={() => {
                        getFullMonthCalendar(nextYear, dayMonthYear.month + 1);
                        setDayMonthYear({ ...dayMonthYear, year: nextYear });
                    }
                    }
                    title={nextYear}
                    textStyle={{ color: dayMonthYear.year == nextYear ? colors.white : colors.typeHeader, fontSize: mvs(15), fontFamily: fonts.carosSoftMedium }}
                    style={{ width: mvs(100), height:  mvs(38), backgroundColor: dayMonthYear.year === nextYear ? colors.primary : unselectedYearColor, marginLeft: mvs(20),...yearStyle }}
                />
            </View>
            <View style={{ marginBottom: mvs(30), }} >
                <ScrollView
                    horizontal
                    ref={scrollViewRef2}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: mvs(10) }}
                    horizontal>
                    {monthNames.map((m, index) => (
                        <Buttons.ButtonSecondaryOutline
                            disabled={index < currentMonth && dayMonthYear.year === currentYear}
                            onClick={() => {
                                getFullMonthCalendar(dayMonthYear.year, index + 1);
                                setDayMonthYear({ ...dayMonthYear, month: index });
                            }}
                            title={m}
                            textStyle={{ color: dayMonthYear.month === index ? colors.white : colors.typeHeader, fontSize: mvs(15), fontFamily: fonts.carosSoftMedium }}
                            style={{ width: mvs(46), height: mvs(65), backgroundColor: dayMonthYear.month === index ? colors.primary : unselectedMonthColor, marginLeft: mvs(10),...monthStyle }}
                        />
                    ))}
                </ScrollView>
            </View>
            <View style={{ backgroundColor: colors.white, paddingHorizontal: mvs(10), paddingVertical: mvs(8), borderBottomLeftRadius: mvs(10), borderTopLeftRadius: mvs(10) ,}}>
                <ScrollView
                    horizontal
                    ref={scrollViewRef}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: mvs(10) }}

                >
                    {month.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            disabled={moment(day).format('DD') < currentDate && currentMonth === dayMonthYear.month && currentYear === dayMonthYear.year}
                            onPress={() => { setDayMonthYear({ ...dayMonthYear, day: moment(day).format('DD') }) }}
                            style={{
                                borderWidth:dayMonthYear.day == moment(day).format('DD')?0:StyleSheet.hairlineWidth,borderColor:colors.doted,width: itemWidth, alignItems: 'center', justifyContent: 'space-between', height: mvs( 90), paddingVertical: mvs(12),
                                backgroundColor: dayMonthYear.day == moment(day).format('DD') ? colors.primary : colors.white, marginRight: mvs(10), borderRadius: mvs(10),
                                ...dayStyle,
                            }}
                        >
                            <Medium label={moment(day).format('dd')}
                                style={{ color: dayMonthYear.day == moment(day).format('DD') ? colors.white : colors.typeHeader, fontSize: mvs( 15), textAlign: 'center' }}
                            />
                            <Medium label={moment(day).format('DD')}
                                style={{ color: dayMonthYear.day == moment(day).format('DD') ? colors.white : colors.label, fontSize: mvs(15), textAlign: 'center' }}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};
export default Calendar;
const styles = StyleSheet.create({
    CALENDAR: {
        marginTop: mvs(15),
        marginBottom:mvs(30),
    },
});