import * as etch from "etch"

interface Props {
  ref: string | undefined
  left: number
  right: number
  top: number
  bottom: number
  text: string | undefined
}

export class TooltipView implements JSX.ElementClass {
  public refs: {
    main: HTMLDivElement
  }
  public props: Props

  constructor() {
    this.props = {
      ref: undefined,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      text: undefined,
    }
    etch.initialize(this)
  }

  public async destroy() {
    return etch.destroy(this)
  }

  public async update(props: Partial<Props>) {
    for (const k of Object.keys(this.props) as Array<keyof Props>) {
      const val = props[k]
      if (val !== undefined && val !== this.props[k]) {
        this.props[k] = val
      }
    }
    await etch.update(this)
  }

  public writeAfterUpdate() {
    const offset = 10
    let left = this.props.right
    let top = this.props.bottom
    let right: number | false = false

    let whiteSpace = ""

    const clientWidth = document.body.clientWidth
    const offsetWidth = this.refs.main.offsetWidth
    const clientHeight = document.body.clientHeight
    const offsetHeight = this.refs.main.offsetHeight

    // X axis adjust
    if (left + offsetWidth >= clientWidth) {
      left = clientWidth - offsetWidth - offset
    }
    if (left < 0) {
      whiteSpace = "pre-wrap"
      left = offset
      right = offset
    }

    // Y axis adjust
    if (top + offsetHeight >= clientHeight) {
      top = this.props.top - offsetHeight
    }

    this.refs.main.style.left = `${left}px`
    this.refs.main.style.top = `${top}px`
    if (right !== false) this.refs.main.style.right = `${right}px`
    if (whiteSpace) this.refs.main.style.whiteSpace = whiteSpace
  }

  public render() {
    return (
      <div ref="main" class="atom-typescript-tooltip tooltip">
        <div class="tooltip-inner" innerHTML={this.props.text || ""} />
      </div>
    )
  }
}
