'use client'
import { TTaskState, addTask, changeTask, removeTask, setTasksFromLocalStorage } from '@/slices/tasksSlice'
import { generateUUID } from '@/utils/functions'
import { useTheme } from 'next-themes'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import style from './page.module.css'

export default function Home() {
  const dispatch = useAppDispatch()
  const AllTasks = useAppSelector((store) => store.tasksSliceReducer)

  const [loading, setLoading] = useState(true)
  const searchBarRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()

  // Разные фильтры заданий
  const [filterState, setFilterState] = useState<'all' | 'checked' | 'unchecked'>('all')
  const filteredByDone = AllTasks.filter((task) => task.done)
  const filteredByUndone = AllTasks.filter((task) => !task.done)

  // Эмулируем экран загрузки и ищем сохраненные данные
  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
    dispatch(setTasksFromLocalStorage())
  }, [dispatch])

  const createNewTask = () => {
    if (!searchBarRef?.current?.value) return
    const inputText = searchBarRef.current.value
    dispatch(addTask({ value: inputText, done: false }))
    searchBarRef.current.value = ''
  }

  const onCheckboxChecked = (e: FormEvent<HTMLInputElement>, i: number) => {
    dispatch(changeTask({ id: i, done: e.currentTarget.checked }))
  }

  const returnTasksByFilter = () => {
    switch (filterState) {
      case 'all':
        return getTasksFromArray(AllTasks)
      case 'checked':
        return getTasksFromArray(filteredByDone)
      case 'unchecked':
        return getTasksFromArray(filteredByUndone)
    }
  }
  // Исходя из переданного фильтра генерируем нужные задачи из списка
  const getTasksFromArray = (arr: TTaskState[]) => {
    return arr.map((task, i) => {
      const checkboxId = generateUUID()
      const keyId = generateUUID()
      return (
        <div key={keyId} className={`${style.task} ${task.done ? style.taskDone : ''}`}>
          <div className={style.taskLeftWrapper}>
            <label htmlFor={checkboxId} className={style.taskCheckboxLabel}>
              <input type="checkbox" id={checkboxId} className={style.taskCheckbox} onChange={(e) => onCheckboxChecked(e, i)} checked={task.done} />
            </label>
            <span className={style.taskText}>{task.value}</span>
          </div>
          <button type="button" className={`${style.taskDelete} ${task.done ? style.taskDoneDelete : ''}`} onClick={(e) => dispatch(removeTask(i))}>
            Удалить
          </button>
        </div>
      )
    })
  }

  return (
    <main className={style.main}>
      {/* экран загрузки */}
      <div className={`${style.loaderWrapper} ${loading ? '' : style.loaderFade}`}>
        <span className={style.loaderTitle}>TodoList</span>
      </div>

      {/* весь контент */}
      <div className={style.content}>
        {/* хедер */}
        <header className={style.header}>
          <h2 className={style.title}>TodoList</h2>
          <label htmlFor="theme-switcher" className={style.switcher}>
            <input
              type="checkbox"
              id="theme-switcher"
              className={style.switcherInput}
              onChange={(e) => setTheme(e.currentTarget.checked ? 'light' : 'dark')}
              checked={theme === 'light'}
            />
            <div className={style.moon}></div>
            <div className={style.switcherToggler}></div>
            <div className={style.sun}></div>
          </label>
        </header>

        {/* поле ввода */}
        <div className={style.inputWrapper}>
          <input
            type="text"
            ref={searchBarRef}
            className={style.searchBarInput}
            placeholder="Введите текст задания"
            onKeyDown={(e) => (e.key === 'Enter' ? createNewTask() : undefined)}
          />
          <button type="button" className={style.plusButton} onClick={createNewTask}>
            Добавить
          </button>
        </div>

        {/* фильтры */}
        <div className={style.filters}>
          <span className={style.filtersTitle}>Отфильтровать по:</span>
          <div className={style.filterButtonsWrapper}>
            <button type="button" className={style.filterButton} onClick={() => setFilterState('checked')}>
              Выполненным
            </button>
            <button type="button" className={style.filterButton} onClick={() => setFilterState('unchecked')}>
              Невыполненным
            </button>
            <button type="button" className={style.filterButton} onClick={() => setFilterState('all')}>
              Выкл
            </button>
          </div>
        </div>

        {/* задания */}
        <div className={style.tasksWrapper}>{returnTasksByFilter()}</div>
      </div>
    </main>
  )
}
