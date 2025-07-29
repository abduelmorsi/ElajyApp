import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CalendarProps = {
  onDateChange?: (date: Date) => void;
  selected?: Date;
  style?: any;
};

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar({ onDateChange, selected, style }: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfWeek(currentMonth, currentYear);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    onDateChange?.(date);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth &&
      selected.getFullYear() === currentYear
    );
  };

  return (
    <View style={[styles.calendarContainer, style]}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {today.toLocaleString("default", { month: "long" })} {currentYear}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekDaysRow}>
        {WEEK_DAYS.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.daysGrid}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <View key={"empty-" + i} style={styles.dayCell} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayCell,
                isSelected(day) && styles.selectedDayCell,
              ]}
              onPress={() => handleSelectDay(day)}
            >
              <Text style={isSelected(day) ? styles.selectedDayText : styles.dayText}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    width: 320,
    alignSelf: "center",
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  navButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  navButtonText: {
    fontSize: 18,
    color: "#333",
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  weekDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  weekDay: {
    width: 32,
    textAlign: "center",
    color: "#888",
    fontWeight: "500",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  dayCell: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
  dayText: {
    color: "#333",
    fontSize: 14,
  },
  selectedDayCell: {
    backgroundColor: "#007bff",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export { Calendar };
